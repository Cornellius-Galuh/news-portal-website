import React from 'react';
import RoleGuard from './role-guard';

interface AuthorRouteProps {
  children?: React.ReactNode;
  fallbackPath?: string;
}

const AuthorRoute = ({ children, fallbackPath = '/' }: AuthorRouteProps) => {
  return (
    <RoleGuard allowedRoles={['AUTHOR', 'ADMIN']} fallbackPath={fallbackPath}>
      {children}
    </RoleGuard>
  );
};

export default AuthorRoute;
