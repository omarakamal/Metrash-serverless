// src/pages/Products/ProductsPage.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import FiltersSidebar from "./FiltersSidebar";
import { fetchProducts } from "../../lib/api";

export default function ProductsPage(){
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState({ products: [], page: 1, totalPages: 1, totalItems: 0, limit: 12 });

  const page = Number(searchParams.get("page") || 1);
  const name = searchParams.get("name") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const limit = Number(searchParams.get("limit") || 12);

  const [form, setForm] = useState({ name, minPrice, maxPrice });

  useEffect(() => { setForm({ name, minPrice, maxPrice }); }, [name, minPrice, maxPrice]);

  useEffect(() => {
    let on = true;
    (async () => {
      try {
        setLoading(true); setError("");
        const json = await fetchProducts({ name, minPrice, maxPrice, page, limit });
        if (on) setData(json);
      } catch (e) {
         if (on) setError(e.message); }
      finally { if (on) setLoading(false); }
    })();
    return () => { on = false; };
  }, [page, name, minPrice, maxPrice, limit]);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (form.name.trim()) params.set("name", form.name.trim());
    if (form.minPrice) params.set("minPrice", String(form.minPrice));
    if (form.maxPrice) params.set("maxPrice", String(form.maxPrice));
    params.set("page", "1");
    params.set("limit", String(limit));
    setSearchParams(params);
  };

  const clearFilters = () => {
    setForm({ name: "", minPrice: "", maxPrice: "" });
    setSearchParams({ page: "1", limit: String(limit) });
  };


  function areParamsPresent(){
    return searchParams.get("maxPrice") || searchParams.get("minPrice") || searchParams.get("name")
  }
  return (
    <main className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <FiltersSidebar form={form} setForm={setForm} onApply={applyFilters} onClear={clearFilters} />

          <section className="lg:col-span-9">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Products</h1>
                {areParamsPresent() ? <p className="mt-1 text-sm text-slate-600">{data.totalItems} item(s) found</p> : <p className="mt-1 text-sm text-slate-600">{data.totalItems} item(s)Total</p>}

         
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-700">Per page</label>
                <select
                  className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
                  value={limit}
                  onChange={(e) => {
                    const params = new URLSearchParams(searchParams);
                    params.set("limit", e.target.value);
                    params.set("page", "1");
                    setSearchParams(params);
                  }}
                >
                  {[8,12,24,48].map(n => (<option key={n} value={n}>{n}</option>))}
                </select>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
              {loading && Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-slate-100" />
              ))}
              {!loading && error && (
                <div className="col-span-full rounded-xl bg-red-50 p-3 text-sm text-red-700 border border-red-200">{error}</div>
              )}
              {!loading && !error && data.items?.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>

            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setSearchParams(prev => { const p = new URLSearchParams(prev); p.set("page", String(Math.max(1, page - 1))); return p; })}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm disabled:opacity-50"
              >Prev</button>
              <span className="text-sm text-slate-700">Page {data.page} of {data.totalPages}</span>
              <button
                disabled={page >= data.totalPages}
                onClick={() => setSearchParams(prev => { const p = new URLSearchParams(prev); p.set("page", String(Math.min(data.totalPages, page + 1))); return p; })}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm disabled:opacity-50"
              >Next</button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
