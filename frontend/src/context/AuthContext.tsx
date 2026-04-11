'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  id: number;
  username: string;
  fullname: string;
  avatar?: string | null;
  role: string;
  email?: string;
  phone?: string;
  address?: string;
  profession?: string;
  birthday?: string;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    console.log('[Auth] Khởi động kiểm tra phiên đăng nhập...');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
        credentials: 'include',
      });
      
      const data = await response.json();
      console.log('[Auth] Kết quả API profile:', { status: response.status, success: data.success });
      
      if (response.ok && data.success) {
        console.log('[Auth] Người dùng đã đăng nhập:', data.user.username);
        setUser(data.user);
      } else {
        console.log('[Auth] Phiên đăng nhập không hợp lệ hoặc đã hết hạn.');
        setUser(null);
      }
    } catch (error) {
      console.error('[Auth] Lỗi trong quá trình checkAuth:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    router.push('/admin');
  };

  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAuthenticated: !!user, 
      login, 
      logout,
      checkAuth 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
