import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { getMe, login as loginApi, register as registerApi } from '../services/authApi';
import { useNavigate } from 'react-router-dom';
import useInactivityTimer from '../hooks/useInactivityTimer';
import { AUTH_SYNC_EVENT } from '../constants/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [sessionExpiredMsg, setSessionExpiredMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const userData = await getMe();
          setUser(userData.user || userData);
        } catch (error) {
          console.error("Failed to fetch user", error);
          localStorage.removeItem('token');
          localStorage.removeItem('lastActivityTimestamp');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  // Listen for forced auth sync events (fired by API interceptor on 401)
  useEffect(() => {
    const handleForceSync = () => {
      const currentToken = localStorage.getItem('token');
      if (!currentToken && token) {
        setToken(null);
        setUser(null);
        setSessionExpiredMsg('Your session has expired. Please sign in again.');
        navigate('/login');
      }
    };

    window.addEventListener(AUTH_SYNC_EVENT, handleForceSync);
    return () => window.removeEventListener(AUTH_SYNC_EVENT, handleForceSync);
  }, [token, navigate]);

  // Auto-dismiss session expired message after 5 seconds
  useEffect(() => {
    if (sessionExpiredMsg) {
      const timer = setTimeout(() => setSessionExpiredMsg(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [sessionExpiredMsg]);

  const login = async (email, password) => {
    try {
      const data = await loginApi(email, password);
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      setSessionExpiredMsg('');
      return data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (name, email, password, confirmPassword) => {
    try {
      const data = await registerApi(name, email, password, confirmPassword);
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      setSessionExpiredMsg('');
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = useCallback((reason) => {
    localStorage.removeItem('token');
    localStorage.removeItem('lastActivityTimestamp');
    setToken(null);
    setUser(null);
    if (reason === 'inactivity') {
      setSessionExpiredMsg('You were signed out due to inactivity.');
    }
    navigate('/');
  }, [navigate]);

  // Inactivity auto-logout — only active when user is authenticated
  const handleInactivityTimeout = useCallback(() => {
    logout('inactivity');
  }, [logout]);

  useInactivityTimer(handleInactivityTimeout, !!user);

  const role = user?.role || 'user';
  const isAdmin = user?.role === 'admin';
  const isModerator = user?.role === 'moderator' || isAdmin;
  const hasRole = (allowedRoles) => {
    if (!user) return false;
    if (Array.isArray(allowedRoles)) {
      return allowedRoles.includes(user.role);
    }
    return user.role === allowedRoles;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        role,
        isAdmin,
        isModerator,
        hasRole,
        sessionExpiredMsg,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
