/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter } from 'react-router';
import MainLayout from '../../components/layouts/main-layout';
import AuthLayout from '../../components/layouts/auth-layout';
import DashboardLayout from '../../components/layouts/dashboard-layout';
import ProtectedRoute from './protected-route';
import GuestRoute from './guest-route';
import RoleGuard from './role-guard';
import AuthorRoute from './author-route';
import AdminRoute from './admin-route';
import LoginPage from '../../pages/auth/login-page';
import RegisterPage from '../../pages/auth/register-page';
import ProfileLayout from '../../pages/profile/profile-layout';
import ProfilePage from '../../pages/profile/profile-page';
import ProfileSettingsPage from '../../pages/profile/profile-settings-page';
import BecomeAuthorPage from '../../pages/author-request/become-author-page';

// Re-export guards for convenient application usage
export { GuestRoute, ProtectedRoute, RoleGuard, AuthorRoute, AdminRoute };

// Placeholder pages (will be replaced with actual page components later)
const HomePage = () => (
  <div className="max-w-7xl mx-auto px-4 py-12">
    <h1 className="text-3xl font-bold">Latest News</h1>
    <p className="text-gray-600 mt-2">Welcome to News Portal</p>
  </div>
);

const DashboardHome = () => (
  <div>
    <h2 className="text-2xl font-bold">Dashboard Home</h2>
    <p className="text-gray-500 mt-2">Dashboard content coming soon</p>
  </div>
);

const AuthorDashboard = () => (
  <div>
    <h2 className="text-2xl font-bold">Author Studio</h2>
    <p className="text-gray-500 mt-2">Author management tools coming soon</p>
  </div>
);

const AdminDashboard = () => (
  <div>
    <h2 className="text-2xl font-bold">Admin Dashboard</h2>
    <p className="text-gray-500 mt-2">Admin content coming soon</p>
  </div>
);

const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <h1 className="text-4xl font-bold text-red-500">404 - Page Not Found</h1>
  </div>
);

const router = createBrowserRouter([
  // Public pages
  {
    element: <MainLayout />,
    children: [{ path: '/', element: <HomePage /> }],
  },

  // Guest-only pages (redirect to home if logged in)
  {
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> },
        ],
      },
    ],
  },

  // Protected pages (redirect to login if not logged in)
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <ProfileLayout />,
        children: [
          { path: '/profile', element: <ProfilePage /> },
          { path: '/profile/settings', element: <ProfileSettingsPage /> },
        ],
      },
      { path: '/become-author', element: <BecomeAuthorPage /> },
      {
        element: <DashboardLayout />,
        children: [{ path: '/dashboard', element: <DashboardHome /> }],
      },
      // Author-only pages (requires AUTHOR or ADMIN role)
      {
        element: <AuthorRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: [{ path: '/author', element: <AuthorDashboard /> }],
          },
        ],
      },
      // Admin-only pages (requires ADMIN role)
      {
        element: <AdminRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: [{ path: '/admin', element: <AdminDashboard /> }],
          },
        ],
      },
    ],
  },

  // 404
  { path: '*', element: <NotFoundPage /> },
]);

export default router;
