import { Outlet } from 'react-router';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar - placeholder */}
      <aside className="w-64 bg-gray-900 text-white p-6 hidden md:block">
        <h2 className="text-lg font-bold mb-8">Dashboard</h2>
        <nav className="space-y-2">
          <a
            href="/dashboard"
            className="block px-4 py-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white"
          >
            Home
          </a>
          <a
            href="/dashboard/articles"
            className="block px-4 py-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white"
          >
            My Articles
          </a>
          <a
            href="/dashboard/settings"
            className="block px-4 py-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white"
          >
            Settings
          </a>
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6">
          <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
