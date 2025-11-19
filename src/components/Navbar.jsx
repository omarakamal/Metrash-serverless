import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from 'axios'
function classNames(...c){return c.filter(Boolean).join(" ");}
import { useAuth } from "../auth/AuthProvider";
export default function Navbar() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  
  const isLoggedIn = useAuth().user
  const {refresh} = useAuth()
  const onSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("name", q.trim());
    navigate({ pathname: "/products", search: params.toString() });
  };

  async function handleLogout(){
     await axios.post('/api/auth/logout')
     refresh()
     navigate('/')

  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sky-600 text-white font-bold shadow-sm">M</span>
            <span className="text-lg font-semibold tracking-tight text-slate-800">Corner Grocer</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/products">Products</NavItem>
            {isLoggedIn && (
              <>
                <NavItem to="/admin/products/new">Create</NavItem>
                <button onClick={handleLogout}>Logout</button>
              </>
            )}
          </nav>

          <form onSubmit={onSubmit} className="flex flex-1 md:flex-initial items-center gap-2">
            <div className="relative w-full md:w-80">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products…"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none ring-0 focus:border-emerald-500 shadow-sm"
              />
              <svg aria-hidden className="absolute left-3 top-2.5 h-5 w-5 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.3-4.3"/>
              </svg>
            </div>
            <button type="submit" className="hidden md:inline-flex items-center rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-700 active:bg-emerald-800">Search</button>
          </form>
        </div>
      </div>
    </header>
  );
}

function NavItem({ to, children }) {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link
      to={to}
      className={classNames(
        "px-2 py-1.5 rounded-md transition-colors",
        active ? "text-sky-700 bg-sky-50" : "text-slate-700 hover:text-sky-700"
      )}
    >
      {children}
    </Link>
  );
}