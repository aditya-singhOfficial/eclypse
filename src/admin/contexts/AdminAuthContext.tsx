import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../../services/api'; // Assuming a general API instance

interface AdminUser {
  id: string;
  email: string;
  // Add other admin user properties as needed
  roles: string[];
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  isAdminAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<React.PropsWithChildren<object>> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Replace with your actual admin login endpoint
      const response = await axiosInstance.post('/api/auth/login', { email, password });
      const { token, user } = response.data; // Assuming API returns token and user data
      localStorage.setItem('adminToken', token); // Store token in localStorage or httpOnly cookie
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setAdmin(user);
    } catch (error) {
      console.error('Admin login failed:', error);
      localStorage.removeItem('adminToken');
      delete axiosInstance.defaults.headers.common['Authorization'];
      setAdmin(null);
      throw error; // Re-throw to be caught by the login form
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // Optional: Call an API endpoint to invalidate the token on the server
      // await axiosInstance.post('/auth/admin/logout');
    } catch (error) {
      console.error('Admin logout error:', error);
      // Still proceed with client-side logout even if server call fails
    } finally {
      localStorage.removeItem('adminToken');
      delete axiosInstance.defaults.headers.common['Authorization'];
      setAdmin(null);
      setIsLoading(false);
      // Redirect to admin login page or public page
      window.location.href = '/admin/login'; // Or use react-router for navigation
    }
  };

  const checkAuth = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('adminToken');
    if (token) {
      try {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        // Replace with your actual endpoint to verify token and get admin user data
        const response = await axiosInstance.get('/auth/admin/me');
        setAdmin(response.data.user);
      } catch (error) {
        console.error('Admin auth check failed:', error);
        localStorage.removeItem('adminToken');
        delete axiosInstance.defaults.headers.common['Authorization'];
        setAdmin(null);
      }
    } else {
      setAdmin(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return <AdminAuthContext.Provider value={{ admin, isAdminAuthenticated: !!admin, isLoading, login, logout, checkAuth }}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};