import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "../api/axiosInstance";
import { jwtDecode } from 'jwt-decode'; // named export

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

function getStoredToken() {
  const t = localStorage.getItem("token");
  if (!t) return null;
  try {
    const payload = jwtDecode(t);
    // jwt 'exp' is seconds since epoch
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return null;
    }
  } catch { return null; }
  return t;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(() => token ? jwtDecode(token) : null);

  // set axios default auth header
  useEffect(() => {
    if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    else delete axios.defaults.headers.common["Authorization"];
  }, [token]);

  // automatic logout based on token expiry
  useEffect(() => {
    if (!token) return;
    const { exp } = jwtDecode(token); 
    const msLeft = exp * 1000 - Date.now();
    const timer = setTimeout(() => {
      logout();
    }, msLeft);
    return () => clearTimeout(timer);
  }, [token]);

  const login = useCallback((jwt) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
    setUser(jwtDecode(jwt));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }, []);

  const value = { token, user, login, logout, isAuthenticated: !!token };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
