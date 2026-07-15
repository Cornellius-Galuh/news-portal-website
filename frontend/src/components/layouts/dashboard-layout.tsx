import { Outlet, Link } from 'react-router';
import useAuthStore from '../../store/auth.store';

const DashboardLayout = () => {
  const user = useAuthStore((state) => state.currentUser);
  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6 hidden md:block">
        <h2 className="text-lg font-bold mb-8">Dashboard</h2>
        <nav className="space-y-2">
          <Link
            to="/dashboard"
            className="block px-4 py-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
          >
            Home
          </Link>
          <Link
            to="/dashboard/articles"
            className="block px-4 py-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
          >
            My Articles
          </Link>
          <Link
            to="/dashboard/settings"
            className="block px-4 py-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
          >
            Settings
          </Link>

          {isAdmin && (
            <div className="pt-6 mt-6 border-t border-gray-800">
              <span className="block px-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                Admin Studio
              </span>
              <Link
                to="/admin"
                className="block px-4 py-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
              >
                Admin Overview
              </Link>
              <Link
                to="/admin/categories"
                className="block px-4 py-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors font-semibold text-[#D74108]"
              >
                Topic Categories
              </Link>
            </div>
          )}
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shrink-0">
          <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
          {user && (
            <div className="flex items-center gap-3 text-sm">
              <span className="text-gray-600 font-medium">{user.username}</span>
              <span className="px-2 py-0.5 bg-gray-900 text-white text-[11px] font-mono font-bold rounded">
                {user.role}
              </span>
            </div>
          )}
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
