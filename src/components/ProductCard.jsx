import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const { name, price, description, imageUrl, id } = product;
  return (
    <Link to={`/products/${id || "#"}`} state={{product}} className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md" >
      <div className="aspect-[4/5] w-full overflow-hidden bg-slate-50">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400">No image</div>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-sm font-semibold text-slate-900">{name}</h3>
          <span className="shrink-0 rounded-lg bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">BD {Number(price).toFixed(2)}</span>
        </div>
        {description && (
          <p className="mt-1 line-clamp-2 text-xs text-slate-600">{description.slice(0,10)}...</p>
        )}
      </div>
    </Link>
  );
}