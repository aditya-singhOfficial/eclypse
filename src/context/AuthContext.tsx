import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Check if user is already logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          setIsLoading(true);
          try {
            const response = await authAPI.getUserProfile();
            setUser(response.data);
          } catch (profileErr) {
            console.warn('Could not fetch user profile on app load:', profileErr);
            // If profile fetch fails but we have a token, create a minimal user object
            // This allows the app to work even if the profile endpoint is not available
            const fallbackUser: User = {
              _id: 'unknown',
              name: 'User',
              email: 'user@example.com',
              role: 'user'
            };
            setUser(fallbackUser);
          }
        }
      } catch (err) {
        console.error('Authentication error:', err);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoggedIn();
  }, []);// Login function
  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await authAPI.login(email, password);
      
      // The token is already stored by authAPI.login
      // Small delay to ensure localStorage is updated and interceptor can use it
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Check if user data is included in login response
      if (response.data.user) {
        setUser(response.data.user);
      } else {
        // If user data not in login response, try to fetch it
        try {
          const userResponse = await authAPI.getUserProfile();
          setUser(userResponse.data);
        } catch (userErr) {
          console.warn('Could not fetch user profile after login:', userErr);
          // Create minimal user object from login response if available
          const userData = {
            _id: response.data.userId || response.data.id || 'unknown',
            name: response.data.name || 'User',
            email: email, // Use the email from login
            role: response.data.role || 'user'
          };
          setUser(userData);
        }
      }
    } catch (err: unknown) {
      const error = err as ApiError;
      setError(error.response?.data?.message || error.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  // Register function
  const register = async (name: string, email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      await authAPI.register({ name, email, password });
      // Login after successful registration
      await login(email, password);
    } catch (err: unknown) {
      const error = err as ApiError;
      setError(error.response?.data?.message || error.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
