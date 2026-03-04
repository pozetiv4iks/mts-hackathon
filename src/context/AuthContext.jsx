import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api/api';

const AuthContext = createContext(null);

function loadStoredUser() {
  try {
    const raw = localStorage.getItem('user_data');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadStoredUser);
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const persistUser = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('user_data', JSON.stringify(userData));
    } else {
      localStorage.removeItem('user_data');
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('access_token');
      if (storedToken) {
        try {
          const userData = await api.getUser('me', storedToken).catch(() => null);
          if (userData) {
            persistUser(userData);
          } else if (!loadStoredUser()) {
            localStorage.removeItem('access_token');
            setToken(null);
            persistUser(null);
          }
        } catch {
          localStorage.removeItem('access_token');
          setToken(null);
          persistUser(null);
        }
      } else {
        persistUser(null);
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = useCallback(async (username, password) => {
    setError(null);
    setLoading(true);
    try {
      const response = await api.login(username, password);
      const { access_token } = response;

      localStorage.setItem('access_token', access_token);
      setToken(access_token);

      const userData = await api.getUser(username, access_token);
      persistUser(userData);

      return { success: true, user: userData };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (username, password) => {
    setError(null);
    setLoading(true);
    try {
      const newUser = await api.createUser({ username, password });
      return { success: true, user: newUser };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    setToken(null);
    setUser(null);
    navigate('/login');
  }, [navigate]);

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
