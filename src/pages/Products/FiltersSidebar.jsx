// src/pages/Products/FiltersSidebar.jsx
import React from "react";

export default function FiltersSidebar({ form, setForm, onApply, onClear }){
  return (
    <aside className="lg:col-span-3">
      <div className="sticky top-24 rounded-2xl border border-slate-200 p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Filter products</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              placeholder="e.g. milk"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-700">Min price</label>
              <input
                type="number" min={0}
                value={form.minPrice}
                onChange={(e) => setForm((s) => ({ ...s, minPrice: e.target.value }))}
                placeholder="0"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Max price</label>
              <input
                type="number" min={0}
                value={form.maxPrice}
                onChange={(e) => setForm((s) => ({ ...s, maxPrice: e.target.value }))}
                placeholder="100"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <button onClick={onApply} className="inline-flex flex-1 items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700">Apply</button>
            <button onClick={onClear} className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:border-emerald-500">Clear</button>
          </div>
        </div>
      </div>
    </aside>
  );
}