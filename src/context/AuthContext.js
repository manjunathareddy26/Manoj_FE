import React, { createContext, useContext } from 'react';
import useAuthStore from './authStore';

// Create context for compatibility with SignUp/SignIn pages
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { user, setUser, token, setToken, setLoading, setError } = useAuthStore();

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        setAuthError: setError,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
