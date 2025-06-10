import React, { createContext, useState, useEffect } from 'react';
import { login, refreshToken } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const signIn = async (credentials) => {
    try {
      const { access, refresh } = await login(credentials);
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      setIsAuthenticated(true);
      // Fetch user data here if needed
    } catch (error) {
      throw error;
    }
  };

  const signOut = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
          setIsAuthenticated(true);
        } else {
          const refresh = localStorage.getItem('refresh_token');
          if (refresh) {
            const { access } = await refreshToken();
            localStorage.setItem('access_token', access);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        signOut();
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};