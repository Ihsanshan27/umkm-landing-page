import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAdminTheme } from '../context/AdminThemeContext';
import {
  LayoutDashboard,
  Building2,
  FileCode,
  Coffee,
  Image as ImageIcon,
  MessageSquare,
  Users as UsersIcon,
  TrendingUp,
  Search,
  Globe,
  LogOut,
  Menu,
  X,
  ShieldAlert,
  Sun,
  Moon,
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const { isDark, toggle: toggleTheme } = useAdminTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const coManageLandingPageId = localStorage.getItem('coManageLandingPageId');
  const coManageBusinessName = localStorage.getItem('coManageBusinessName');

  const handleExitCoManagement = () => {
    localStorage.removeItem('coManageLandingPageId');
    localStorage.removeItem('coManageBusinessName');
    localStorage.removeItem('coManageSlug');
    window.location.href = '/admin';
  };

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  // Navigation menus
  const ownerMenu = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Business Profile', path: '/dashboard/profile', icon: Building2 },
    { name: 'Hero & About', path: '/dashboard/landing-page', icon: FileCode },
    { name: 'Products & Services', path: '/dashboard/products', icon: Coffee },
    { name: 'Gallery Items', path: '/dashboard/gallery', icon: ImageIcon },
    { name: 'Testimonials', path: '/dashboard/testimonials', icon: MessageSquare },
    { name: 'Leads & Form', path: '/dashboard/leads', icon: UsersIcon },
    { name: 'SEO Settings', path: '/dashboard/seo', icon: Search },
    { name: 'Custom Domain', path: '/dashboard/domain', icon: Globe },
  ];

  // Menu co-manage pakai /co-manage/* routes
  const coManageMenu = [
    { name: 'Overview', path: '/co-manage', icon: LayoutDashboard },
    { name: 'Business Profile', path: '/co-manage/profile', icon: Building2 },
    { name: 'Hero & About', path: '/co-manage/landing-page', icon: FileCode },
    { name: 'Products & Services', path: '/co-manage/products', icon: Coffee },
    { name: 'Gallery Items', path: '/co-manage/gallery', icon: ImageIcon },
    { name: 'Testimonials', path: '/co-manage/testimonials', icon: MessageSquare },
    { name: 'Leads & Form', path: '/co-manage/leads', icon: UsersIcon },
    { name: 'SEO Settings', path: '/co-manage/seo', icon: Search },
    { name: 'Custom Domain', path: '/co-manage/domain', icon: Globe },
  ];

  const adminMenu = [
    { name: 'Platform Stats', path: '/admin', icon: TrendingUp },
    { name: 'Manage Users', path: '/admin/users', icon: UsersIcon },
    { name: 'Landing Pages', path: '/admin/sites', icon: FileCode },
    { name: 'Leads Overview', path: '/admin/leads', icon: ShieldAlert },
  ];

  const currentMenu = isSuperAdmin
    ? (coManageLandingPageId ? coManageMenu : adminMenu)
    : ownerMenu;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getSlugLink = () => {
    const coManageSlug = localStorage.getItem('coManageSlug');
    if (coManageSlug) return `/site/${coManageSlug}`;
    if (user?.business?.landingPage?.slug) return `/site/${user.business.landingPage.slug}`;
    return null;
  };

  // Tema classes
  const themeRoot = isDark ? 'bg-slate-950 text-slate-100' : 'admin-light bg-slate-100 text-slate-900';
  const themeSidebar = isDark
    ? 'bg-slate-900/60 border-slate-800/80'
    : 'bg-white/90 border-slate-200';
  const themeMenuActive = 'bg-brand-600 text-white shadow-lg shadow-brand-600/20';
  const themeMenuIdle = isDark
    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100';
  const themeHeader = isDark
    ? 'bg-slate-900 border-slate-800/80'
    : 'bg-white border-slate-200 shadow-sm';
  const themeMain = isDark ? 'bg-slate-950' : 'bg-slate-50';

  const SidebarContent = () => (
    <>
      {/* Brand */}
      <div className={`flex items-center gap-3 px-2 py-3 mb-4 border-b pb-4 ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center font-bold text-white shadow-lg shadow-brand-500/20 shrink-0">
          L
        </div>
        <div className="flex-1 min-w-0">
          <h1 className={`text-sm font-bold tracking-tight leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>UMKM Builder</h1>
          <span className={`text-[10px] font-medium tracking-wider uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {isSuperAdmin ? 'SUPER ADMIN' : 'BUSINESS DASHBOARD'}
          </span>
        </div>
        {/* Dark/Light Toggle */}
        <button
          onClick={toggleTheme}
          title={isDark ? 'Mode Terang' : 'Mode Gelap'}
          className={`p-1.5 rounded-lg transition shrink-0 ${isDark ? 'text-amber-400 hover:bg-slate-800' : 'text-violet-500 hover:bg-slate-100'}`}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Live Site Shortcut */}
      {getSlugLink() && (
        <a
          href={getSlugLink()}
          target="_blank"
          rel="noreferrer"
          className="mb-4 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/20 text-brand-400 hover:text-brand-300 text-xs font-semibold transition-all duration-300 group"
        >
          <Globe className="w-3.5 h-3.5 transition-transform group-hover:rotate-12" />
          Lihat Landing Page
        </a>
      )}

      {/* Menu Items — scrollable */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto min-h-0">
        {currentMenu.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                isActive ? themeMenuActive : themeMenuIdle
              }`}
            >
              <Icon className={`w-4 h-4 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User info + Logout — FIXED at bottom, never scrolls */}
      <div className={`pt-3 border-t mt-3 shrink-0 ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
        <div className={`px-3 py-2 rounded-xl mb-2 ${isDark ? 'bg-slate-950/40 border border-slate-800/40' : 'bg-slate-100 border border-slate-200'}`}>
          <span className={`text-xs font-semibold truncate block ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{user?.name}</span>
          <span className={`text-[10px] truncate block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{user?.email}</span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/10 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Keluar Sesi
        </button>
      </div>
    </>
  );

  return (
    <div className={`h-screen flex flex-col transition-colors duration-300 overflow-hidden ${themeRoot}`}>
      {/* Co-Management Banner */}
      {coManageLandingPageId && (
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white px-4 py-2 text-center text-xs font-bold flex items-center justify-center gap-3 shadow-md z-50 shrink-0 sticky top-0">
          <ShieldAlert className="w-4 h-4 animate-pulse text-amber-100" />
          <span>MODE BANTUAN AKTIF: Anda sedang membantu mengelola <strong>{coManageBusinessName}</strong></span>
          <button
            onClick={handleExitCoManagement}
            className="ml-3 px-3 py-1 bg-white hover:bg-slate-100 text-orange-700 hover:text-orange-800 rounded-lg text-[10px] font-extrabold uppercase transition shadow-sm shrink-0"
          >
            Keluar Bantuan
          </button>
        </div>
      )}

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
        {/* Sidebar Desktop — flex column, full height, logout always at bottom */}
        <aside className={`hidden md:flex md:flex-col md:w-60 border-r backdrop-blur-xl shrink-0 p-3 h-full ${themeSidebar}`}>
          <SidebarContent />
        </aside>

        {/* Mobile Header */}
        <header className={`md:hidden flex items-center justify-between px-4 py-3 border-b sticky top-0 z-50 ${themeHeader}`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center font-bold text-white">L</div>
            <span className={`text-sm font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>UMKM Builder</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-1.5 rounded-lg transition ${isDark ? 'text-amber-400 hover:bg-slate-800' : 'text-violet-500 hover:bg-slate-100'}`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`p-1.5 rounded-lg transition ${isDark ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className={`md:hidden fixed inset-0 top-[53px] z-40 p-4 flex flex-col animate-fade-in ${isDark ? 'bg-slate-950/95' : 'bg-white/95'}`}>
            <SidebarContent />
          </div>
        )}

        {/* Main Content */}
        <main className={`flex-1 p-4 md:p-8 overflow-y-auto max-w-full ${themeMain}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
