// src/auth/AuthProvider.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios'

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    console.log('fetchme function called')
    setLoading(true);
    try {
      const res = await axios.get('/.netlify/functions/me', { credentials: 'include' });
      console.log('fetchme: ', res )
      console.log('res.data',res.data)
      if (!res.statusText) {
        setUser(null);
      } else {
        const payload =  res.data;
        console.log('payload: ',payload)
        setUser(payload.user || null);
      }
    } catch (err) {
      console.log('error',err)
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMe(); }, [fetchMe]);



  async function login({ email, password }) {
    const res = await fetch('/.netlify/functions/login', {
      method: 'POST',
      credentials: 'include', // must include cookies
      headers: { 'Content-Tdype': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      // try to surface friendly message
      let payload = {};
      try { payload = await res.json(); } catch {}
      throw new Error(payload?.message || `Login failed (${res.status})`);
    }

    // cookie is set by server (httpOnly). fetchMe reads it and returns user.
    // await fetchMe();
    setUser(res.json())

    return true;
  }

  async function logout() {
    await fetch('/.netlify/functions/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAdmin: !!(user && (user.role === 'admin' || (user.roles && user.roles.includes('admin')))),
      loading,
      login,
      logout,
      refresh: fetchMe,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
