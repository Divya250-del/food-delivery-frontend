// src/context/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import { API } from "../api/authApi.js"; // adjust path

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await API.get("/api/auth/me");

      setUser(res.data.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser(); // called only once
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading,setUser  }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);