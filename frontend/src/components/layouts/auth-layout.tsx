import { Outlet, Link } from 'react-router';
import { Newspaper } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[#E3E1DE] text-[#353535] flex flex-col justify-between py-10 px-4 font-sans selection:bg-[#D74108] selection:text-white">
      {/* Newspaper Top Bar / Masthead Header */}
      <header className="w-full max-w-xl mx-auto mb-6">
        <div className="border-2 border-[#353535] bg-[#F9F8F6] p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(53,53,53,1)]">
          <div className="flex items-center justify-between border-b-2 border-[#353535] pb-3 mb-3 text-xs font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Newspaper className="w-4 h-4 text-[#D74108]" />
              Paperio News
            </span>
            <span className="bg-[#D74108] text-white px-2 py-0.5 rounded font-mono text-[10px]">
              ISSUE NO. 01
            </span>
            <span>EST. 2026</span>
          </div>

          <div className="text-center">
            <Link
              to="/"
              className="inline-block font-serif text-2xl sm:text-3xl font-extrabold tracking-tight hover:text-[#D74108] transition-colors"
            >
              BREAKING NEWS PORTAL
            </Link>
          </div>
        </div>
      </header>

      {/* Main Editorial Form Block */}
      <main className="w-full max-w-xl mx-auto flex-1 flex items-center justify-center my-2">
        <div className="w-full p-6 sm:p-8 bg-[#F9F8F6] border-2 border-[#353535] rounded-2xl shadow-[6px_6px_0px_0px_rgba(53,53,53,1)] relative overflow-hidden">
          {/* Subtle Decorative Print Banner Corner */}
          <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
            <div className="absolute top-2 -right-6 bg-[#353535] text-white text-[9px] font-bold uppercase py-0.5 px-6 rotate-45 tracking-widest shadow-sm">
              DIGITAL
            </div>
          </div>

          <Outlet />
        </div>
      </main>

      {/* Editorial Footer */}
      <footer className="w-full max-w-xl mx-auto mt-6 text-center text-xs font-semibold text-[#353535] uppercase tracking-wider space-y-1">
        <div className="border-t-2 border-[#353535] pt-4 flex flex-wrap justify-center gap-4">
          <span>© 2026 Paperio News Portal</span>
          <span>•</span>
          <a href="#" className="hover:text-[#D74108] transition-colors">
            Terms & Services
          </a>
          <span>•</span>
          <a href="#" className="hover:text-[#D74108] transition-colors">
            Privacy Policy
          </a>
          <span>•</span>
          <a href="#" className="hover:text-[#D74108] transition-colors">
            Editorial Guidelines
          </a>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
