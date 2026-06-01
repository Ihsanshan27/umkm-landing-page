import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminThemeContext = createContext();

export function AdminThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('adminTheme') !== 'light';
  });

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('adminTheme', next ? 'dark' : 'light');
  };

  return (
    <AdminThemeContext.Provider value={{ isDark, toggle }}>
      {children}
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  return useContext(AdminThemeContext);
}
