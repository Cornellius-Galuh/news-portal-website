import { Navigate, Outlet } from 'react-router';
import useAuthStore from '../../store/auth.store';

interface RoleGuardProps {
  allowedRoles: string[];
}

const RoleGuard = ({ allowedRoles }: RoleGuardProps) => {
  const user = useAuthStore((state) => state.user);

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RoleGuard;
