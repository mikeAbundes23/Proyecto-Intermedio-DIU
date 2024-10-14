import React, { createContext, useState, useEffect } from 'react';
import { getCookie, setCookie } from '../helpers/auth';

export const AuthContext = createContext();
const cookieName = process.env.REACT_APP_TOKEN_COOKIE_NAME;

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = getCookie(`${cookieName}`);
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (token) => {
    setCookie(cookieName,token, process.env.REACT_APP_TOKEN_EXPIRATION_TIME);
    setIsAuthenticated(true);
  };

  const logout = () => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
