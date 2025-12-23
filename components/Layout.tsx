import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  BarChart2, 
  Settings, 
  Plus, 
  Menu, 
  X,
  Target,
  LogOut,
  Sun,
  Moon
} from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label, collapsed }: { to: string, icon: any, label: string, collapsed?: boolean }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => `
      flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group
      ${isActive 
        ? 'bg-green-100 text-emerald-800 border-green-200 dark:bg-primary/10 dark:text-primary dark:border-primary/20 shadow-sm dark:shadow-neon' 
        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'}
    `}
  >
    <Icon size={24} className="transition-transform group-hover:scale-110" />
    {!collapsed && <span className="font-medium font-display text-sm">{label}</span>}
  </NavLink>
);

const Layout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const location = useLocation();

  useEffect(() => {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark');
  };

  // Avatar Image from user mockups
  const avatarUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuAnzULPDotOFW76XwCFTqBFPrO5C9-yJlqmOT36g2P5-EynXH3mEMG_BHlh2Skahw9jpeGezKAk5fHXkoKDvhK8jAi64F99mgwXhFxpHFehxR_GhG0214E7a57JjkMWf6ZrrG_jkR5GnUlX7C19Z1EGjCvVD7icalef-1vTLU9-XZssEOTxC-5CoJtPgO8fjbfMwNQY0sVuKOOewx2-rfvmqz4dnckyJPB6puvH88-uOIqwpMETJM8chN7d6nME5I4RnuQtQOlf2-U";

  const handleLogout = () => {
    // Simple mock logout
    if (confirm("Are you sure you want to log out?")) {
      window.location.reload();
    }
  };

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark overflow-hidden transition-colors duration-300">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#102216] border-r border-gray-200 dark:border-white/5 p-4 flex flex-col justify-between transition-all duration-300 shadow-xl lg:shadow-none
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col gap-8">
          {/* Brand */}
          <div className="flex items-center gap-3 px-2 mt-2">
            <div className="relative group cursor-pointer">
              <div 
                className="bg-center bg-no-repeat bg-cover rounded-full h-10 w-10 ring-2 ring-primary/20 group-hover:ring-primary transition-all"
                style={{ backgroundImage: `url("${avatarUrl}")` }}
              />
              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-primary border-2 border-white dark:border-[#102216]"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-gray-900 dark:text-white text-base font-bold leading-tight font-display tracking-tight">TraderOne</h1>
              <p className="text-emerald-700 dark:text-primary-dim text-xs font-medium uppercase tracking-wider">Pro Account</p>
            </div>
            {/* Close Mobile Menu */}
            <button 
              className="ml-auto lg:hidden text-gray-400 hover:text-gray-900 dark:hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-2">
            <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" />
            <SidebarItem to="/journal" icon={BookOpen} label="Journal" />
            <SidebarItem to="/analytics" icon={BarChart2} label="Analytics" />
            <SidebarItem to="/strategies" icon={Target} label="Strategies" />
            <SidebarItem to="/settings" icon={Settings} label="Settings" />
          </nav>
        </div>

        {/* Action Button & Theme Toggle */}
        <div className="space-y-4">
           {/* Theme Toggle */}
           <button 
             onClick={toggleTheme}
             className="w-full flex items-center justify-between px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-primary transition-colors border border-transparent hover:border-gray-200 dark:hover:border-white/10"
           >
             <div className="flex items-center gap-2">
               {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
               <span className="text-sm font-medium">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
             </div>
             <div className={`w-8 h-4 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-primary/20' : 'bg-gray-300'}`}>
                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white dark:bg-primary transition-all shadow-sm ${theme === 'dark' ? 'left-4.5' : 'left-0.5'}`} style={{ left: theme === 'dark' ? '18px' : '2px' }}></div>
             </div>
           </button>

          <div>
            <NavLink 
              to="/journal" 
              state={{ mode: 'entry' }}
              className="flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl h-12 bg-primary hover:bg-[#34f575] hover:shadow-neon text-[#112217] transition-all group mb-4"
            >
              <Plus className="font-bold group-hover:rotate-90 transition-transform" size={20} />
              <span className="truncate text-sm font-bold tracking-wide font-display">LOG TRADE</span>
            </NavLink>
            <button 
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-3 text-gray-500 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
            >
              <LogOut size={20} />
              <span className="text-sm font-medium">Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 shrink-0 border-b border-gray-200 dark:border-white/5 flex items-center justify-between px-4 bg-white/80 dark:bg-[#102216]/80 backdrop-blur-md sticky top-0 z-20 transition-colors">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-primary/20 flex items-center justify-center text-emerald-700 dark:text-primary">
              <LayoutDashboard size={18} />
            </div>
            <span className="font-bold text-gray-900 dark:text-white font-display">TraderOne</span>
          </div>
          <button onClick={() => setMobileMenuOpen(true)} className="text-gray-900 dark:text-white">
            <Menu size={24} />
          </button>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark scroll-smooth transition-colors duration-300">
            <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;