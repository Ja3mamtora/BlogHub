import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();
const TOKEN_EXPIRY_TIME = 15 * 60 * 1000;

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    token: null,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const expiryTime = localStorage.getItem('expiryTime');

    if (token && expiryTime && Date.now() < expiryTime) {
      setAuthState({
        isAuthenticated: true,
        expiryTime: expiryTime,
        token: token
      });
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('expiryTime', Date.now() + TOKEN_EXPIRY_TIME);
    localStorage.setItem('token', token);
    setAuthState({
      isAuthenticated: true,
      expiryTime:Date.now() + TOKEN_EXPIRY_TIME,
      token: token
    });
  };

  const logout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    setAuthState({
      isAuthenticated: false,
      expiryTime: null,
      token: null
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};