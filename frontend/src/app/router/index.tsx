import { createBrowserRouter } from 'react-router';
import MainLayout from '../../components/layouts/main-layout';
import AuthLayout from '../../components/layouts/auth-layout';
import DashboardLayout from '../../components/layouts/dashboard-layout';
import ProtectedRoute from './protected-route';
import GuestRoute from './guest-route';
import RoleGuard from './role-guard';

// Placeholder pages (will be replaced with actual page components later)
const HomePage = () => (
    <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold">Latest News</h1>
        <p className="text-gray-600 mt-2">Welcome to News Portal</p>
    </div>
);

const LoginPage = () => (
    <div>
        <h2 className="text-xl font-bold text-center mb-4">Login</h2>
        <p className="text-gray-500 text-center">Login form coming soon</p>
    </div>
);

const RegisterPage = () => (
    <div>
        <h2 className="text-xl font-bold text-center mb-4">Register</h2>
        <p className="text-gray-500 text-center">Register form coming soon</p>
    </div>
);

const DashboardHome = () => (
    <div>
        <h2 className="text-2xl font-bold">Dashboard Home</h2>
        <p className="text-gray-500 mt-2">Dashboard content coming soon</p>
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
                element: <DashboardLayout />,
                children: [{ path: '/dashboard', element: <DashboardHome /> }],
            },
            // Admin-only pages
            {
                element: <RoleGuard allowedRoles={['ADMIN']} />,
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
