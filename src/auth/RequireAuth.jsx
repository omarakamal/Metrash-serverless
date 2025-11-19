import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function RequireAuth({ children, adminOnly = false, redirectTo = "/auth/login" }) {
  const auth = useAuth();
  const location = useLocation();

  // while we’re checking session, show a spinner to avoid UI flash
  if (auth.loading) return <div>Loading...</div>;

  // not logged in -> redirect to login and save where they wanted to go
  if (!auth.isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // if adminOnly and user is not admin -> show forbidden or redirect
  if (adminOnly && !auth.isAdmin) {
    // Option 1: redirect to home
    return <Navigate to="/" replace />;
    // Option 2: show a 403 component
    // return <div>Forbidden</div>;
  }

  return children;
}
