'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authClient';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProtectedRoute = ({ children, fallback }: ProtectedRouteProps) => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/admin/login');
      } else {
        setShowFallback(false);
      }
    } else {
      setShowFallback(true);
    }
  }, [isAuthenticated, isLoading, router]);

  if (showFallback || isLoading) {
    return fallback || <div>Loading...</div>;
  }

  return <>{children}</>;
};

export { ProtectedRoute };