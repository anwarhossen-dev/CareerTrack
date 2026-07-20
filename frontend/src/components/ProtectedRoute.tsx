import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  setView: (view: string) => void;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, setView }) => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      setView('login');
    }
  }, [user, loading, setView]);

  if (loading) {
    return <LoadingSpinner fullHeight label="Verifying session..." />;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
