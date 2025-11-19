// src/pages/Home/HighlightedItems.jsx
import React, { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";
import { fetchProducts } from "../../lib/api";

export default function HighlightedItems(){
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let on = true;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchProducts({ limit: 8 });
        console.log(data)
        if (on) setItems(data.items || []);
      } catch (e) { if (on) setError(e.message); }
      finally { if (on) setLoading(false); }
    })();
    return () => { on = false; };
  }, []);

  return (
    <section className="py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Popular picks</h2>
          <a href="/products" className="text-sm font-medium text-sky-700 hover:text-sky-800">View all</a>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {loading && Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-slate-100" />
          ))}
          {!loading && error && (
            <div className="col-span-full text-sm text-red-600">{error}</div>
          )}
          {!loading && !error && items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
