import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiChartBar, 
  HiCube, 
  HiUserGroup, 
  HiClipboardList, 
  HiTrendingUp, 
  HiCog, 
  HiLogout, 
  HiChevronLeft, 
  HiMenu
} from 'react-icons/hi';
import { useAuth } from '../../hooks/useAuth';
import { sidebarVariants } from '../../animations/variants';

export const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: HiChartBar },
    { name: 'Products', path: '/products', icon: HiCube },
    { name: 'Suppliers', path: '/suppliers', icon: HiUserGroup },
    { name: 'Inventory', path: '/inventory', icon: HiClipboardList },
    { name: 'Reports', path: '/reports', icon: HiTrendingUp },
    { name: 'Settings', path: '/settings', icon: HiCog },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderNavContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-100">
      {/* Brand Logo Header */}
      <div className="flex items-center justify-between h-20 px-6 border-b border-slate-50 dark:border-slate-800/60">
        <div className="flex items-center space-x-3 overflow-hidden select-none" onClick={() => navigate('/dashboard')}>
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-primary-400 text-white font-extrabold text-xl shadow-md shadow-primary-500/20 shrink-0">
            I
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="text-lg font-black tracking-tight font-sans bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 shrink-0"
              >
                Invento<span className="text-primary-500 font-medium">SaaS</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        
        {/* Toggle Collapse - Desktop only */}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-200 transition"
        >
          <HiChevronLeft className={`w-5 h-5 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                relative flex items-center h-12 px-4 rounded-xl text-sm font-semibold transition-all group
                ${isActive 
                  ? 'text-primary-600 dark:text-primary-400' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/30'
                }
              `}
            >
              {/* Floating Background Highlight for Active Tab */}
              {isActive && (
                <motion.div
                  layoutId="activeNavHighlight"
                  className="absolute inset-0 bg-primary-50 dark:bg-primary-950/20 rounded-xl z-0"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              {/* Nav Link Contents */}
              <div className="relative z-10 flex items-center w-full">
                <Icon className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-primary-500' : ''}`} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="ml-3 font-sans truncate"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Tooltip for Collapsed view */}
              {collapsed && (
                <div className="absolute left-20 scale-0 group-hover:scale-100 bg-slate-900 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-xl transition-all duration-150 origin-left z-50 whitespace-nowrap">
                  {item.name}
                </div>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-4 border-t border-slate-50 dark:border-slate-800/60 flex flex-col space-y-3">
        {/* User Card */}
        <div className="flex items-center px-2 py-1 overflow-hidden">
          <img 
            src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"} 
            alt={user?.name}
            className="w-10 h-10 rounded-xl object-cover ring-2 ring-primary-500/20 shrink-0"
          />
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="ml-3 overflow-hidden select-none shrink-0"
              >
                <h4 className="text-sm font-bold truncate text-slate-800 dark:text-slate-200">{user?.name}</h4>
                <p className="text-xs font-semibold truncate text-slate-400 dark:text-slate-500">{user?.role}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="
            relative flex items-center h-12 px-4 rounded-xl text-sm font-semibold
            text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition group
          "
        >
          <div className="flex items-center w-full">
            <HiLogout className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="ml-3 font-sans truncate"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Collapsed Logout Tooltip */}
          {collapsed && (
            <div className="absolute left-20 scale-0 group-hover:scale-100 bg-rose-500 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-xl transition-all duration-150 origin-left z-50 whitespace-nowrap">
              Logout
            </div>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop view inline Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={collapsed ? 'collapsed' : 'expanded'}
        className="hidden md:block h-screen sticky top-0 shrink-0 z-40 overflow-hidden"
      >
        {renderNavContent()}
      </motion.aside>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-xs z-40 md:hidden"
            />
            {/* Slide-out Sidebar Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 w-[260px] z-50 md:hidden"
            >
              {renderNavContent()}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
export default Sidebar;
