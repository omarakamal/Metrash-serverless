// src/components/AdminProductEditForm.jsx
import { useState, useEffect } from "react";
import { updateProduct } from "../lib/api";

function zodFormatToFieldErrors(format) {
  const map = {};
  if (format && typeof format === "object") {
    for (const [k, v] of Object.entries(format)) {
      if (v && Array.isArray(v._errors) && v._errors.length) map[k] = v._errors[0];
    }
  }
  return map;
}

export default function AdminProductEditForm({ id, initial, onSaved, queryParamId = false }) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    price: initial?.price ?? "",
    imageUrl: initial?.imageUrl ?? "",
    description: initial?.description ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // keep in sync if "initial" arrives later
  useEffect(() => {
    if (!initial) return;
    setForm({
      name: initial.name ?? "",
      price: initial.price ?? "",
      imageUrl: initial.imageUrl ?? "",
      description: initial.description ?? "",
    });
  }, [initial]);

  async function onSubmit(e) {
    e.preventDefault();
    setServerError("");
    setFieldErrors({});

    // Build payload for your Zod UpdateProduct schema.
    // If UpdateProduct is .partial(), you can send only what changed.
    const payload = {
      name: form.name?.trim(),
      // your server uses z.coerce.number() so strings like "2.45" are ok,
      // but we’ll be explicit:
      price: form.price === "" ? undefined : Number(form.price),
      imageUrl: form.imageUrl?.trim() || undefined,
      description: form.description?.trim() || undefined,
    };
    // remove undefined keys (PUT with partial body is okay in your handler)
    Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);

    try {
      setSaving(true);
      const updated = await updateProduct(id, payload, { queryParamId });
      onSaved?.(updated);
    } catch (err) {
      setServerError(err.message || "Update failed");
      if (err.issues) setFieldErrors(zodFormatToFieldErrors(err.issues));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-4">
      {serverError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700">Name</label>
        <input
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="Product name"
        />
        {fieldErrors.name && <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Price</label>
        <input
          type="number"
          min="0"
          step="0.01"
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
          value={form.price}
          onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
          placeholder="e.g., 2.45"
        />
        {fieldErrors.price && <p className="mt-1 text-sm text-red-600">{fieldErrors.price}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Image URL</label>
        <input
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
          value={form.imageUrl}
          onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
          placeholder="https://…"
        />
        {fieldErrors.imageUrl && <p className="mt-1 text-sm text-red-600">{fieldErrors.imageUrl}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Description</label>
        <textarea
          rows={4}
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="Optional"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
