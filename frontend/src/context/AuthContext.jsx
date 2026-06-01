import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const token = localStorage.getItem('umkm_token');
      if (token) {
        const data = await api.getMe();
        setUser(data);
      }
    } catch (err) {
      console.error('Session expired or invalid', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await api.login({ email, password });
      localStorage.setItem('umkm_token', data.access_token);
      const fullUser = await api.getMe();
      setUser(fullUser);
      return fullUser;
    } finally {
      setLoading(false);
    }
  };

  const register = async (dto) => {
    setLoading(true);
    try {
      return await api.register(dto);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('umkm_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, fetchMe, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
