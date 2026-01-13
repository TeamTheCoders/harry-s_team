'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { jwtVerify } from 'jose';
import { Admin } from '@/types/admin';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: Admin | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// JWT secret from environment variables
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-here-change-in-production'
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Admin | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on initial load
    const token = localStorage.getItem('auth-token');
    if (token) {
      validateToken(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const validateToken = async (token: string) => {
    try {
      const verified = await jwtVerify(token, JWT_SECRET);
      setIsAuthenticated(true);
      setUser({
        id: verified.payload.sub as string,
        email: verified.payload.email as string,
        password: '', // Never store password in client
        createdAt: new Date(verified.payload.createdAt as string),
        isActive: verified.payload.isActive as boolean,
      });
    } catch (error) {
      console.error('Token validation error:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Make API call to authenticate
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.token) {
        // Store token in localStorage (in a real app, use secure cookies)
        localStorage.setItem('auth-token', data.token);
        setIsAuthenticated(true);
        setUser(data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth-token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};