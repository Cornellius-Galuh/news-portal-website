import { Outlet, Link, useLocation } from 'react-router';
import { Newspaper, ArrowLeft, User as UserIcon, Settings, LogOut } from 'lucide-react';
import useAuthStore from '../../store/auth.store';

const ProfileLayout = () => {
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.currentUser);

  const isOverview = location.pathname === '/profile' || location.pathname === '/profile/';
  const isSettings = location.pathname.includes('/settings');

  return (
    <div className="min-h-screen bg-[#E3E1DE] text-[#353535] flex flex-col justify-between py-10 px-4 font-sans selection:bg-[#D74108] selection:text-white">
      {/* Newspaper Masthead Header */}
      <header className="w-full max-w-4xl mx-auto mb-8">
        <div className="border-2 border-[#353535] bg-[#F9F8F6] p-5 sm:p-6 rounded-2xl shadow-[6px_6px_0px_0px_rgba(53,53,53,1)]">
          {/* Top meta row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-[#353535] pb-3 mb-4 text-xs font-bold uppercase tracking-wider gap-2">
            <span className="flex items-center gap-1.5 text-[#D74108]">
              <Newspaper className="w-4 h-4" />
              <span>Paperio News Portal • Dossier Archive</span>
            </span>
            <div className="flex items-center gap-4">
              <span className="bg-[#353535] text-white px-2 py-0.5 rounded font-mono text-[10px]">
                USER ID: {user?._id?.slice(-6) || 'ACTIVE'}
              </span>
              <Link to="/" className="inline-flex items-center gap-1 hover:text-[#D74108] transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Portal</span>
              </Link>
            </div>
          </div>

          {/* Headline Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight uppercase text-[#353535]">
                Editorial Dossier
              </h1>
              <p className="text-sm font-medium text-gray-600 font-sans mt-0.5">
                Manage your public newsstand identity, bio, and publishing preferences.
              </p>
            </div>

            {/* Logout Action */}
            <button
              onClick={() => logout()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-red-50 text-red-600 font-bold text-xs uppercase tracking-wider rounded-lg border-2 border-[#353535] shadow-[3px_3px_0px_0px_rgba(53,53,53,1)] hover:shadow-[1px_1px_0px_0px_rgba(53,53,53,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all self-start sm:self-auto"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Tab Navigation Bar */}
          <nav className="flex items-center gap-3 mt-6 pt-4 border-t-2 border-dashed border-[#CBC8B9]">
            <Link
              to="/profile"
              className={`px-5 py-2.5 rounded-lg border-2 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
                isOverview && !isSettings
                  ? 'bg-[#353535] text-white border-[#353535] shadow-[3px_3px_0px_0px_rgba(215,65,8,1)]'
                  : 'bg-white text-[#353535] border-[#353535] hover:bg-gray-100 shadow-[3px_3px_0px_0px_rgba(53,53,53,1)]'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>1. Profile Overview</span>
            </Link>

            <Link
              to="/profile/settings"
              className={`px-5 py-2.5 rounded-lg border-2 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
                isSettings
                  ? 'bg-[#353535] text-white border-[#353535] shadow-[3px_3px_0px_0px_rgba(215,65,8,1)]'
                  : 'bg-white text-[#353535] border-[#353535] hover:bg-gray-100 shadow-[3px_3px_0px_0px_rgba(53,53,53,1)]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>2. Edit Dossier & Avatar</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Profile View Container */}
      <main className="w-full max-w-4xl mx-auto flex-1">
        <Outlet />
      </main>

      {/* Editorial Footer */}
      <footer className="w-full max-w-4xl mx-auto mt-12 text-center text-xs font-semibold text-[#353535] uppercase tracking-wider space-y-1">
        <div className="border-t-2 border-[#353535] pt-5 flex flex-wrap justify-center gap-4">
          <span>© 2026 Paperio News Portal</span>
          <span>•</span>
          <Link to="/" className="hover:text-[#D74108] transition-colors">
            Portal Home
          </Link>
          <span>•</span>
          <a href="#" className="hover:text-[#D74108] transition-colors">
            Author Network
          </a>
          <span>•</span>
          <a href="#" className="hover:text-[#D74108] transition-colors">
            Terms & Privacy
          </a>
        </div>
      </footer>
    </div>
  );
};

export default ProfileLayout;
