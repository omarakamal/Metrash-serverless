import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider"; // or './useAuth'

export default function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/products";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await auth.login({ email, password }); // calls /api/auth/login and fetches /api/auth/me
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  // Prevent showing the login if we're still resolving existing session
  if (auth.loading) return <div>Loading...</div>;

  return (
    <div className="login-page">
      <h2>Admin login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input required value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
        </label>

        <label>
          Password
          <input required value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
        </label>

        <button type="submit" disabled={submitting}>Log in</button>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>
    </div>
  );
}
