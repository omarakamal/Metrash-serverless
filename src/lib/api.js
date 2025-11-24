import axios from 'axios'
export async function fetchProducts(paramsObj = {}) {
  console.log('Function called')

  const params = new URLSearchParams();
  Object.entries(paramsObj).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).trim() !== "") params.set(k, String(v));
  });
  console.log(`/.netlify/functions/products?${params.toString()}`)
  const res = await axios.get(`/.netlify/functions/products?${params.toString()}`);
  console.log(res)
  if (!res.statusText) throw new Error("Failed to fetch products");
  return res.data;
}
export async function fetchProduct(id) {
  if (!id) throw new Error("Missing product id");
  console.log(id)
  const res = await fetch(`/.netlify/functions/products/${id}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error("Product not found");
    throw new Error("Failed to fetch product");
  }
  return res.json();
}



export async function createProduct({ name, price, description = "", imageUrl = "" }) {
  const res = await fetch("/.netlify/functions/products", {
    method: "POST",
    credentials: "include", // important if your POST is admin-gated by a cookie
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, price, description, imageUrl }),
  });

  // handle non-2xx; surface Zod errors nicely
  if (!res.ok) {
    let payload = {};
    try { payload = await res.json(); } catch {}
    const message =
      payload?.message ||
      payload?.error ||
      `Request failed (${res.status})`;
    const issues = payload?.issues || null; // zod .format() from your function
    const err = new Error(message);
    err.issues = issues;
    throw err;
  }

  return res.json();
}




// src/api/products.js
export async function updateProduct(id, payload, { queryParamId = false } = {}) {
  // If your netlify.toml maps /api/products/:id -> /.netlify/functions/…?id=:id,
  // this path works directly:
  const url = queryParamId
    ? `/.netlify/functions/products?id=${encodeURIComponent(id)}`
    : `/.netlify/functions/products/${encodeURIComponent(id)}`;

  const res = await fetch(url, {
    method: "PUT",
    credentials: "include",                 // send admin cookie
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),          // MUST be JSON; your function does JSON.parse
  });

  if (!res.ok) {
    let payload = {};
    try { payload = await res.json(); } catch {}
    const err = new Error(payload?.message || `Update failed (${res.status})`);
    err.issues = payload?.issues || null;   // Zod .format() from your function
    throw err;
  }

  // Your function returns the updated product doc
  return res.json();
}


export async function deleteProduct(id, opts = {}) {
  const { queryParamId = false, signal } = opts;

  const url = queryParamId
    ? `/.netlify/functions/products?id=${encodeURIComponent(id)}`
    : `/.netlify/functions/products/${encodeURIComponent(id)}`;

  const res = await fetch(url, {
    method: "DELETE",
    credentials: "include", // include cookies for admin auth
    signal,
  });

  // Many backends return 204 No Content on successful delete
  if (res.status === 204) return;

  // Some might return 200 with JSON; treat 2xx as success anyway
  if (res.ok) {
    // Optional: if server sent a body, you can consume it
    // const data = await res.json().catch(() => null);
    return;
  }

  // Map common error responses to useful messages
  let payload = {};
  try { payload = await res.json(); } catch {}
  const msg = payload?.message || (
    res.status === 404 ? "Product not found" :
    res.status === 401 ? "Unauthorized" :
    res.status === 403 ? "Forbidden" :
    `Delete failed (${res.status})`
  );
  const err = new Error(msg);
  err.status = res.status;
  err.payload = payload;
  throw err;
}