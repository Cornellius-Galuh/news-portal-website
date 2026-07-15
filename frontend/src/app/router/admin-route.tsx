import React from 'react';
import RoleGuard from './role-guard';

interface AdminRouteProps {
  children?: React.ReactNode;
  fallbackPath?: string;
}

const AdminRoute = ({ children, fallbackPath = '/' }: AdminRouteProps) => {
  return (
    <RoleGuard allowedRoles={['ADMIN']} fallbackPath={fallbackPath}>
      {children}
    </RoleGuard>
  );
};

export default AdminRoute;
