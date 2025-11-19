import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { fetchProduct,deleteProduct } from "../../lib/api";

import { useAuth } from "../../auth/AuthProvider";


function currency(n) {
  if (n === null || n === undefined || isNaN(Number(n))) return "";
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(Number(n));
  } catch {
    return `$${Number(n).toFixed(2)}`;
  }
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
    const locaiton = useLocation();
  const initial = locaiton.state?.product || null

  const [product, setProduct] = useState(initial);

  const isLoggedIn = useAuth().user



  useEffect(() => {
    if (product) {return setLoading(false)};
    let on = true;
    (async () => {
      try {
        setLoading(true); setError("");
        const json = await fetchProduct(id);
        if (on) setProduct(json);
      } catch (e) {
        if (on) setError(e.message || "Failed to load product");
      } finally {
        if (on) setLoading(false);
      }
    })();
    return () => { on = false; };
  }, [id]);

  // Normalize a primary image + gallery from possible fields
  const { primaryImage, gallery } = useMemo(() => {
    const images = [];

    if (product) {
      const candidates = [
        product.image_url,
        product.imageUrl,
        product.thumbnail,
        product.coverImage,
      ].filter(Boolean);

      if (Array.isArray(product.images)) {
        product.images.forEach((it) => {
          if (!it) return;
          if (typeof it === "string") images.push(it);
          else if (typeof it.url === "string") images.push(it.url);
        });
      }

      candidates.forEach((c) => { if (typeof c === "string") images.push(c); });

      const unique = Array.from(new Set(images));
      return {
        primaryImage: unique[0] || null,
        gallery: unique.length ? unique : (product.gallery || [])
      };
    }
    return { primaryImage: null, gallery: [] };
  }, [product]);




   async function onDelete(id) {
    console.log(id)
    if (!confirm("Delete this product? This cannot be undone.")) return;
    try {
      await deleteProduct(id); // or deleteProduct(id, { queryParamId: true })
      navigate('/products')
    } catch (e) {
      alert(e.message || "Failed to delete");
      setItems(prev); // rollback
    }
  }


  if (loading) {
    return (
      <main className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <div className="h-4 w-40 rounded bg-slate-100 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <div className="aspect-square w-full rounded-2xl bg-slate-100 animate-pulse" />
              <div className="mt-4 grid grid-cols-5 gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-xl bg-slate-100 animate-pulse" />
                ))}
              </div>
            </div>
            <div className="lg:col-span-6 space-y-4">
              <div className="h-8 w-2/3 rounded bg-slate-100 animate-pulse" />
              <div className="h-6 w-1/3 rounded bg-slate-100 animate-pulse" />
              <div className="h-24 w-full rounded bg-slate-100 animate-pulse" />
              <div className="h-10 w-40 rounded-xl bg-slate-100 animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 text-sm">
            {error}
          </div>
          <div className="mt-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm hover:bg-slate-50"
            >
              Go back
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!product) return null;

  // 👇 Use whichever id is available; fall back to URL param
  const productId = product.id || product._id || id;

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-slate-600">
            <li><Link to="/" className="hover:text-slate-900">Home</Link></li>
            <li className="text-slate-400">/</li>
            <li><Link to="/products" className="hover:text-slate-900">Products</Link></li>
            <li className="text-slate-400">/</li>
            <li className="text-slate-900">{product.name || `#${id}`}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Gallery */}
          <section className="lg:col-span-6">
            <div className="aspect-square w-full overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {primaryImage ? (
                <img
                  src={primaryImage}
                  alt={product.name || "Product image"}
                  className="h-full w-full object-cover"
                  loading="eager"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">
                  No image
                </div>
              )}
            </div>

            {gallery?.length > 1 && (
              <div className="mt-4 grid grid-cols-5 gap-3">
                {gallery.slice(0, 5).map((url, idx) => (
                  <button
                    key={url + idx}
                    onClick={(e) => e.currentTarget?.scrollIntoView({ behavior: "smooth", block: "nearest" })}
                    className="aspect-square overflow-hidden rounded-xl border border-slate-200"
                    aria-label={`Gallery image ${idx + 1}`}
                  >
                    <img src={url} alt="" className="h-full w-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Details */}
          <section className="lg:col-span-6">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {product.name || "Untitled product"}
            </h1>

            {/* Price */}
            {product.price !== undefined && (
              <p className="mt-2 text-xl font-semibold text-emerald-700">
                {currency(product.price)}
              </p>
            )}

            {/* Short meta row */}
            <dl className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 text-sm">
              {"sku" in product && product.sku ? (
                <div className="flex items-center gap-2">
                  <dt className="text-slate-500">SKU:</dt>
                  <dd className="font-medium text-slate-800">{product.sku}</dd>
                </div>
              ) : null}
              {"category" in product && product.category ? (
                <div className="flex items-center gap-2">
                  <dt className="text-slate-500">Category:</dt>
                  <dd className="font-medium text-slate-800">{product.category}</dd>
                </div>
              ) : null}
            </dl>

            {/* Description */}
            {(product.description || product.details) && (
              <div className="mt-6">
                <h2 className="text-sm font-semibold text-slate-900">Description</h2>
                <p className="mt-2 text-sm leading-6 text-slate-700 whitespace-pre-line">
                  {product.description || product.details}
                </p>
              </div>
            )}

            {/* CTA row */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {/* Edit link → passes the loaded product as initial state */}
              {isLoggedIn && (
              <Link
                to={`/admin/products/${productId}/edit`}
                state={{ product }}                  // 👈 this is the "initial" on the edit page
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
              >
                Edit
              </Link>
              )}
              

              <button
                className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm hover:bg-slate-50"
                onClick={() => window.history.back()}
              >
                Back
              </button>

              {isLoggedIn && (
              <button
                className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm hover:bg-red-50"
                onClick={() => onDelete(product._id)}
              >
                Delete
              </button>
              )}
             
            </div>

            {/* Additional info list (optional) */}
            {"features" in product && Array.isArray(product.features) && product.features.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-slate-900">Features</h3>
                <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
                  {product.features.map((f, i) => <li key={i}>{String(f)}</li>)}
                </ul>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
