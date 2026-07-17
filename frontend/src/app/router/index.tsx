/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter, Link } from 'react-router';
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
import CategoriesPage from '../../pages/categories/categories-page';
import CategoryDetailPage from '../../pages/categories/category-detail-page';
import AdminCategoriesPage from '../../pages/admin/categories/admin-categories-page';
import CreateArticlePage from '../../pages/author/create-article-page';
import DraftsPage from '../../pages/author/drafts-page';
import ArchivedArticlesPage from '../../pages/author/archived-articles-page';
import EditArticlePage from '../../pages/author/edit-article-page';
import ArticleDetailPage from '../../pages/articles/article-detail-page';
import SearchPage from '../../pages/articles/search-page';
import TrendingPage from '../../pages/articles/trending-page';
import HomePage from '../../pages/home-page';

// Re-export guards for convenient application usage
export { GuestRoute, ProtectedRoute, RoleGuard, AuthorRoute, AdminRoute };

const DashboardHome = () => (
  <div>
    <h2 className="text-2xl font-bold">Dashboard Home</h2>
    <p className="text-gray-500 mt-2">Dashboard content coming soon</p>
  </div>
);

const AuthorDashboard = () => (
  <div className="space-y-8 py-4">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Author Studio</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Write new stories, manage saved drafts, and review your archived articles.
        </p>
      </div>
      <Link
        to="/author/articles/create"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
      >
        + Write New Article
      </Link>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Link
        to="/author/articles/create"
        className="group p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-blue-500 dark:bg-slate-900 dark:border-slate-800 transition-all"
      >
        <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-105 transition-transform dark:bg-blue-900/40 dark:text-blue-400">
          ✍️
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
          Write Story
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Draft and publish new news stories with Tiptap rich text and gallery support.
        </p>
      </Link>

      <Link
        to="/author/articles/drafts"
        className="group p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-amber-500 dark:bg-slate-900 dark:border-slate-800 transition-all"
      >
        <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-105 transition-transform dark:bg-amber-900/40 dark:text-amber-400">
          📝
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400">
          Draft Management
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review, update, or publish your unreleased stories and work in progress.
        </p>
      </Link>

      <Link
        to="/author/articles/archived"
        className="group p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-purple-500 dark:bg-slate-900 dark:border-slate-800 transition-all"
      >
        <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-105 transition-transform dark:bg-purple-900/40 dark:text-purple-400">
          🗄️
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
          Archived Stories
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Inspect your retired or archived stories and restore them back to drafts if needed.
        </p>
      </Link>
    </div>
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
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/categories', element: <CategoriesPage /> },
      { path: '/categories/:slug', element: <CategoryDetailPage /> },
      { path: '/articles/:slug', element: <ArticleDetailPage /> },
      { path: '/search', element: <SearchPage /> },
      { path: '/trending', element: <TrendingPage /> },
    ],
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
            children: [
              { path: '/author', element: <AuthorDashboard /> },
              { path: '/author/articles/create', element: <CreateArticlePage /> },
              { path: '/author/articles/drafts', element: <DraftsPage /> },
              { path: '/author/articles/archived', element: <ArchivedArticlesPage /> },
              { path: '/author/articles/edit/:id', element: <EditArticlePage /> },
            ],
          },
        ],
      },
      // Admin-only pages (requires ADMIN role)
      {
        element: <AdminRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: '/admin', element: <AdminDashboard /> },
              { path: '/admin/categories', element: <AdminCategoriesPage /> },
            ],
          },
        ],
      },
    ],
  },

  // 404
  { path: '*', element: <NotFoundPage /> },
]);

export default router;
