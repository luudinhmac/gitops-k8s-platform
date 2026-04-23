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
  is_active?: boolean;
  can_comment?: boolean;
  can_post?: boolean;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isBackendOffline: boolean; // Track backend connectivity
  login: (userData: User) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBackendOffline, setIsBackendOffline] = useState(false);
  const router = useRouter();

  const checkAuth = async () => {
    console.log('[Auth] Khởi động kiểm tra phiên đăng nhập...');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
        credentials: 'include',
        signal: AbortSignal.timeout(5000), // 5s timeout
      });

      const contentType = response.headers.get('content-type');
      if (!response.ok || !contentType || !contentType.includes('application/json')) {
        console.warn('[Auth] Backend trả về phản hồi không hợp lệ hoặc lỗi hệ thống.');
        if (response.status >= 500) {
          setIsBackendOffline(true);
        }
        setUser(null);
        return;
      }

      const data = await response.json();
      console.log('[Auth] Kết quả API profile:', { status: response.status, success: data.success });

      setIsBackendOffline(false);
      if (response.ok && data.success) {
        console.log('[Auth] Người dùng đã đăng nhập:', data.user.username);
        setUser(data.user);
      } else {
        console.log('[Auth] Phiên đăng nhập không hợp lệ hoặc đã hết hạn.');
        setUser(null);
      }
    } catch (error: any) {
      console.error('[Auth] Lỗi trong quá trình checkAuth:', error.message);
      setIsBackendOffline(true);
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
  };

  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);

      // Clear maintenance bypass cookie
      document.cookie = 'MAINTENANCE_BYPASS=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax';

      // Check if global maintenance is ON to decide where to redirect
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api';
        const maintenanceRes = await fetch(`${apiUrl}/settings/public`);
        const settings = await maintenanceRes.json();
        if (settings.maintenance_global === 'true' || settings.maintenance_global === true) {
          router.push('/maintenance');
        } else {
          router.push('/login');
        }
      } catch (e) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated: !!user,
      isBackendOffline,
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
