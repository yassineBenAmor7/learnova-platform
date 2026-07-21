import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('learnova_token');
      if (token) {
        try {
          const profile = await authService.getMe();
          setUser(profile);
        } catch (err) {
          console.error('Failed to restore auth session:', err);
          authService.logout();
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(email, password);
      let profile = data.user;
      if (!profile) {
        profile = await authService.getMe();
      }
      setUser(profile);
      return profile;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (firstName, lastName, email, password) => {
    setLoading(true);
    setError(null);
    try {
      await authService.register(firstName, lastName, email, password);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const profile = await authService.getMe();
      setUser(profile);
    } catch (err) {
      console.error('Failed to refresh user profile:', err);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin: user?.role?.name === 'ADMIN',
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
