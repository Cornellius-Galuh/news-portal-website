import React from 'react';
import { Navigate, Outlet } from 'react-router';
import useAuthStore from '../../store/auth.store';
import Spinner from '../../components/ui/spinner';

interface GuestRouteProps {
  children?: React.ReactNode;
  redirectTo?: string;
}

const GuestRoute = ({ children, redirectTo = '/' }: GuestRouteProps) => {
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

  if (isUserAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default GuestRoute;
