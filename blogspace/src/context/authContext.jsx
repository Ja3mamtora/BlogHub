import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext();
const TOKEN_EXPIRY_TIME = 15 * 60 * 1000; // 15 minutes

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    token: null,
    expiryTime: null,
  });

  const checkTokenExpiration = useCallback(() => {
    const currentTime = Date.now();
    if (authState.expiryTime && currentTime > authState.expiryTime) {
      logout();
    }
  }, [authState.expiryTime]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const expiryTime = localStorage.getItem('expiryTime');

    if (token && expiryTime && Date.now() < parseInt(expiryTime, 10)) {
      setAuthState({
        isAuthenticated: true,
        token: token,
        expiryTime: parseInt(expiryTime, 10),
      });
    } else {
      logout();
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(checkTokenExpiration, 60000); // Check every minute
    return () => clearInterval(intervalId);
  }, [checkTokenExpiration]);

  const login = (token) => {
    const expiryTime = Date.now() + TOKEN_EXPIRY_TIME;
    localStorage.setItem('token', token);
    localStorage.setItem('expiryTime', expiryTime.toString());
    setAuthState({
      isAuthenticated: true,
      token: token,
      expiryTime: expiryTime,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expiryTime');
    setAuthState({
      isAuthenticated: false,
      token: null,
      expiryTime: null,
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}