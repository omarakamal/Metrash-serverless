// src/pages/AdminCreateProduct.jsx
import { useState } from "react";
import { createProduct } from "../../lib/api";

export default function AdminCreateProduct() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    imageUrl: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(null); // will hold the created product

  function validateLocal(values) {
    const e = {};
    if (!values.name.trim()) e.name = "Name is required";
    if (values.price === "" || isNaN(Number(values.price))) e.price = "Price must be a number";
    else if (Number(values.price) < 0) e.price = "Price must be >= 0";
    if (values.imageUrl && !/^https?:\/\//i.test(values.imageUrl)) {
      e.imageUrl = "Image URL must start with http(s)://";
    }
    return e;
  }

  // Zod .format() → flatten into field messages
  function zodFormatToFieldErrors(format) {
    if (!format || typeof format !== "object") return {};
    const map = {};
    // top-level fields come as: { fieldName: { _errors: ["msg", ...] }, ... }
    for (const [key, val] of Object.entries(format)) {
      if (val && Array.isArray(val._errors) && val._errors.length) {
        map[key] = val._errors[0]; // show first error
      }
    }
    // global (non-field) errors sometimes under _errors
    if (Array.isArray(format._errors) && format._errors.length) {
      map._ = format._errors.join(", ");
    }
    return map;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setServerError("");
    setCreated(null);

    // local validation first
    const eLocal = validateLocal(form);
    setErrors(eLocal);
    if (Object.keys(eLocal).length) return;

    try {
      setLoading(true);
      const payload = {
        name: form.name.trim(),
        price: Number(form.price),
        description: form.description.trim(),
        imageUrl: form.imageUrl.trim(),
      };
      const doc = await createProduct(payload);
      setCreated(doc);
      setForm({ name: "", price: "", description: "", imageUrl: "" });
      setErrors({});
    } catch (err) {
      // map server/Zod errors to fields
      const fieldErrs = zodFormatToFieldErrors(err.issues);
      setErrors(fieldErrs);
      setServerError(err.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold">Create Product</h1>
      <p className="mt-1 text-sm text-slate-600">
        Fill in the details and submit to add a product.
      </p>

      {serverError && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {serverError}{errors._ ? ` — ${errors._}` : ""}
        </div>
      )}

      {created && (
        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          Created: <strong>{created.name}</strong>
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Name</label>
          <input
            type="text"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g., Al Arabi Rice 5kg"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Price</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            placeholder="e.g., 2.45"
          />
          {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Image URL (optional)</label>
          <input
            type="url"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            value={form.imageUrl}
            onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
            placeholder="https://…/image.jpg"
          />
          {errors.imageUrl && <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Description</label>
          <textarea
            rows={4}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Short description (optional)"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
          >
            {loading ? "Creating…" : "Create product"}
          </button>
        </div>
      </form>
    </main>
  );
}
