import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import useAuthStore from '../../store/auth.store';
import Spinner from '../../components/ui/spinner';

export interface RoleGuardProps {
  allowedRoles: string[];
  fallbackPath?: string;
  children?: React.ReactNode;
}

const RoleGuard = ({ allowedRoles, fallbackPath = '/', children }: RoleGuardProps) => {
  const location = useLocation();
  const currentUser = useAuthStore((state) => state.currentUser);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="lg" />
      </div>
    );
  }

  const isUserAuthenticated = isAuthenticated || Boolean(accessToken);

  // If not authenticated at all, redirect to login with location state
  if (!isUserAuthenticated || !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user role is not in the allowed roles list, redirect to fallback path
  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default RoleGuard;
