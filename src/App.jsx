// src/App.jsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import RequireAuth from "./auth/RequireAuth";
import { AuthProvider } from "./auth/AuthProvider";
import Navbar from "./components/Navbar";
import HomePage from "./pages/Home/Homepage";
import ProductsPage from "./pages/Products/ProductPage";
import ProductDetailPage from "./pages/Products/ProductDetailPage";
import AdminCreateProduct from "./pages/AdminCreateProduct/AdminCreateProduct";
import AdminEditProduct from "./pages/AdminEditProduct/AdminEditProduct";
import LoginPage from "./pages/Login/Login";
function NotFound() {
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center">
        <p className="text-sm font-medium text-emerald-700">404</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-white text-slate-800">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/auth/login" element={<LoginPage />} />

            <Route
              path="/admin/products/new"
              element={<RequireAuth><AdminCreateProduct /></RequireAuth>}
            />
            <Route
              path="/admin/products/:id/edit"
              element={<RequireAuth><AdminEditProduct /></RequireAuth>}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
