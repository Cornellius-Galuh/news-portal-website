import React, { useEffect, useState } from 'react';
import { Outlet, Link } from 'react-router';
import useAuthStore from '../../store/auth.store';
import {
  ChevronDown,
  Globe,
  Search,
  Sun,
  User as UserIcon,
} from 'lucide-react';
import { categoryService } from '../../features/categories';
import type { Category } from '../../features/categories';

const MainLayout: React.FC = () => {
  const { isAuthenticated, currentUser: user } = useAuthStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentDateString, setCurrentDateString] = useState<string>('');

  useEffect(() => {
    const date = new Date();
    const formatted = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const time = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    setCurrentDateString(`${formatted} — ${time}`);

    const loadCategories = async () => {
      try {
        const response = await categoryService.getCategories({ limit: 10 });
        if (response.data) {
          setCategories(response.data);
        }
      } catch (err) {
        console.error('Failed to load categories for nav', err);
      }
    };
    loadCategories();
  }, []);

  const defaultCategories = [
    { name: 'News', slug: 'news' },
    { name: 'World', slug: 'world' },
    { name: 'Business', slug: 'business' },
    { name: 'Art', slug: 'art' },
    { name: 'Lifestyle', slug: 'lifestyle' },
    { name: 'Sport', slug: 'sport' },
    { name: 'Opinion', slug: 'opinion' },
    { name: 'Culture', slug: 'culture' },
    { name: 'Politic', slug: 'politic' },
  ];

  const navCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <div className="min-h-screen flex flex-col bg-[#E8E5DF] text-[#353535] font-sans selection:bg-[#D74108] selection:text-white">
      {/* Top Masthead Header (3-column layout exact like Paperio reference) */}
      <header className="border-b border-[#353535] bg-[#E8E5DF] sticky top-0 z-50">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center border-b border-[#353535]">
          {/* Left: InfoSalatiga branding + Date & Weather */}
          <div className="md:col-span-3 border-b md:border-b-0 md:border-r border-[#353535] px-4 py-3 flex items-center justify-between md:justify-start gap-4 text-xs font-semibold tracking-wide">
            <Link to="/" className="flex items-center gap-2 hover:text-[#D74108] transition-colors">
              <Globe className="w-4 h-4 text-[#D74108]" />
              <span className="font-serif font-bold text-sm tracking-tight">InfoSalatiga</span>
            </Link>
            <div className="flex items-center gap-1.5 text-[#353535]/80 border-l border-[#353535] pl-3">
              <Sun className="w-3.5 h-3.5 text-[#D74108]" />
              <span>{currentDateString || '24 Dec, 2026 — 08:25 AM'}</span>
            </div>
          </div>

          {/* Center: Masthead Title */}
          <div className="md:col-span-6 py-4 px-4 text-center">
            <Link to="/" className="inline-block group">
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase text-[#353535] group-hover:text-[#D74108] transition-colors">
                BREAKING NEWS PORTAL
              </h1>
            </Link>
          </div>

          {/* Right: Profile & Studio */}
          <div className="md:col-span-3 border-t md:border-t-0 md:border-l border-[#353535] px-4 py-3 flex items-center justify-end gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {user?.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className="rounded-none bg-[#353535] text-white px-2.5 py-0.5 text-[10px] font-bold uppercase hover:bg-[#D74108] transition-colors"
                  >
                    Admin
                  </Link>
                )}

                {(user?.role === 'AUTHOR' || user?.role === 'ADMIN') && (
                  <Link
                    to="/author"
                    className="rounded-none border border-[#353535] bg-white/40 px-2.5 py-0.5 text-[10px] font-bold uppercase hover:bg-[#D74108] hover:text-white hover:border-[#D74108] transition-colors"
                  >
                    Studio
                  </Link>
                )}

                <Link
                  to="/profile"
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#353535] hover:text-[#D74108] transition-colors"
                  title={user?.username}
                >
                  <div className="w-6 h-6 rounded-none border border-[#353535] overflow-hidden bg-white flex items-center justify-center">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <span className="hidden xl:inline truncate max-w-[80px]">{user?.username}</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-semibold">
                <Link to="/login" className="hover:text-[#D74108] transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="border border-[#353535] rounded-none px-3 py-0.5 bg-[#353535] text-white hover:bg-[#D74108] hover:border-[#D74108] transition-colors"
                >
                  Join
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Category Navigation Bar (border-t/b with Newspaper selector and horizontal categories) */}
        <nav className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider overflow-x-auto bg-[#E8E5DF]">
          <Link
            to="/categories"
            className="border-r border-[#353535] px-4 py-2.5 flex items-center gap-1.5 whitespace-nowrap hover:bg-[#D74108] hover:text-white transition-colors"
          >
            <span>Newspaper</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center gap-6 px-6 py-2 overflow-x-auto no-scrollbar">
            <Link to="/trending" className="hover:text-[#D74108] transition-colors whitespace-nowrap font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-none bg-[#D74108]"></span>
              Trending
            </Link>
            {navCategories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/categories/${cat.slug}`}
                className="hover:text-[#D74108] transition-colors whitespace-nowrap"
              >
                {cat.name}
              </Link>
            ))}
            <Link to="/search" className="hover:text-[#D74108] transition-colors whitespace-nowrap">
              Advertisement
            </Link>
            <Link to="/categories" className="hover:text-[#D74108] transition-colors whitespace-nowrap">
              Job Portal
            </Link>
          </div>

          <Link
            to="/search"
            className="border-l border-[#353535] px-4 py-2.5 flex items-center justify-center hover:bg-[#D74108] hover:text-white transition-colors"
            title="Search news"
          >
            <Search className="w-4 h-4" />
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      {/* Footer in Paperio/InfoSalatiga Vintage Style */}
      <footer className="border-t border-[#353535] bg-[#E8E5DF] text-[#353535] mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Giant Vintage Newspaper Masthead inside Footer */}
          <div className="border-b border-[#353535] py-10 text-center overflow-hidden">
            <h2 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tight text-[#353535] leading-none select-none">
              InfoSalatiga News
            </h2>
          </div>

          {/* Bottom Grid Info Bar */}
          <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs sm:text-sm border-b border-[#353535]">
            <div className="text-center md:text-left">
              <p className="font-semibold">All right reserved</p>
              <p className="text-[#353535]/70">&copy; InfoSalatiga News {new Date().getFullYear()}</p>
            </div>

            <div className="text-center">
              <p className="font-semibold uppercase tracking-wider text-xs">We're Locate At</p>
              <p className="text-[#353535]/80">Gendongan, Salatiga, Indonesia</p>
            </div>

            <div className="text-center md:text-right">
              <p className="font-semibold uppercase tracking-wider text-xs">Contact</p>
              <p className="font-mono text-[#353535]/90">0812345678</p>
            </div>
          </div>

          {/* Footer Horizontal Navigation Links */}
          <div className="py-5 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-semibold uppercase tracking-wider">
            <Link to="/search" className="hover:text-[#D74108] transition-colors">Terms & Services</Link>
            <Link to="/categories" className="hover:text-[#D74108] transition-colors">Our Blog</Link>
            <Link to="/trending" className="hover:text-[#D74108] transition-colors">FAQ</Link>
            <Link to="/search?sort=viewCount" className="hover:text-[#D74108] transition-colors">Our Stories</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
