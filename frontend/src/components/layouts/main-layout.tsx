import { Outlet } from 'react-router';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* Navbar - placeholder, will be built properly later */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-indigo-600">
            NewsPortal
          </a>
          <div className="flex items-center gap-4">
            <a href="/login" className="text-sm text-gray-600 hover:text-gray-900">
              Login
            </a>
            <a
              href="/register"
              className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Register
            </a>
          </div>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} NewsPortal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
