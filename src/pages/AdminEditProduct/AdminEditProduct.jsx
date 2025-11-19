// src/pages/AdminEditProduct.jsx
import { useParams, useNavigate, useLocation } from "react-router-dom";
import AdminProductEditForm from "../../components/AdminProductEditForm";

export default function AdminEditProduct() {
  const { id } = useParams();
  const nav = useNavigate();
  const initial = useLocation()?.state?.product || null;

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Edit Product</h1>
      <AdminProductEditForm
        id={id}
        initial={initial}
        // set to true only if your redirect uses ?id= without :id path:
        queryParamId={false}
        onSaved={() => nav("/admin/products")}
      />
    </main>
  );
}
