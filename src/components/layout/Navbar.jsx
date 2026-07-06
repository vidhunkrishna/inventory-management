import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiMenuAlt2, 
  HiBell, 
  HiSun, 
  HiMoon, 
  HiChevronRight,
  HiUser,
  HiCog,
  HiLogout
} from 'react-icons/hi';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useProducts } from '../../hooks/useProducts';
import { dropdownVariants } from '../../animations/variants';
import Avatar from '../ui/Avatar';

export const Navbar = ({ setMobileOpen }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { products } = useProducts();
  const location = useLocation();
  const navigate = useNavigate();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Format breadcrumbs: e.g. /dashboard -> Dashboard, /products -> Products
  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(x => x);
    if (paths.length === 0) return [{ name: 'Dashboard', path: '/dashboard' }];
    return paths.map((path, idx) => {
      const name = path.charAt(0).toUpperCase() + path.slice(1);
      const url = `/${paths.slice(0, idx + 1).join('/')}`;
      return { name, path: url };
    });
  };

  // Generate real-time alerts based on product quantities
  const getAlerts = () => {
    const lowStock = products.filter(p => p.quantity > 0 && p.quantity <= 10);
    const outOfStock = products.filter(p => p.quantity === 0);
    
    const alerts = [];
    
    outOfStock.forEach(p => {
      alerts.push({
        id: `alert-out-${p.id}`,
        title: 'Critical Out of Stock',
        message: `${p.name} (SKU: ${p.sku}) is out of stock!`,
        time: 'Just now',
        type: 'critical'
      });
    });

    lowStock.forEach(p => {
      alerts.push({
        id: `alert-low-${p.id}`,
        title: 'Low Stock Alert',
        message: `${p.name} is running low (${p.quantity} left).`,
        time: '1 hour ago',
        type: 'warning'
      });
    });

    // Fallback default notification
    if (alerts.length === 0) {
      alerts.push({
        id: 'alert-default',
        title: 'System Normal',
        message: 'All systems operational. No inventory warnings.',
        time: 'Today',
        type: 'info'
      });
    }

    return alerts;
  };

  const breadcrumbs = getBreadcrumbs();
  const alerts = getAlerts();

  // Get current date formatted
  const getCurrentDate = () => {
    const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
    return new Date().toLocaleDateString(undefined, options);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="h-20 px-6 sticky top-0 z-30 flex items-center justify-between glass-nav select-none">
      
      {/* Breadcrumbs & Mobile Menu Icon */}
      <div className="flex items-center space-x-4">
        {/* Toggle Hamburger menu - Mobile only */}
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden flex items-center justify-center p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-700 dark:hover:text-slate-200 transition"
        >
          <HiMenuAlt2 className="w-6 h-6" />
        </button>

        {/* Desktop Breadcrumbs list */}
        <div className="hidden md:flex items-center space-x-1.5 text-sm font-semibold">
          <Link to="/dashboard" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition">
            Admin
          </Link>
          <HiChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-700" />
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={crumb.path}>
                {idx > 0 && <HiChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-700" />}
                {isLast ? (
                  <span className="text-slate-800 dark:text-slate-100 font-bold">{crumb.name}</span>
                ) : (
                  <Link to={crumb.path} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition">
                    {crumb.name}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Date Indicator, Notifications, Theme, Profile */}
      <div className="flex items-center space-x-3.5">
        
        {/* Current Date Display */}
        <div className="hidden lg:block text-xs font-bold text-slate-400 dark:text-slate-500 mr-2">
          {getCurrentDate()}
        </div>

        {/* Theme Toggle UI */}
        <button
          onClick={toggleTheme}
          className="
            relative flex items-center justify-center w-10 h-10 rounded-xl
            border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 
            text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-slate-200
            transition duration-150 active:scale-90
          "
        >
          {theme === 'dark' ? <HiSun size={20} className="text-amber-500" /> : <HiMoon size={20} />}
        </button>

        {/* Notifications Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="
              relative flex items-center justify-center w-10 h-10 rounded-xl
              border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 
              text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-slate-200
              transition duration-150 active:scale-90
            "
          >
            <HiBell size={20} />
            {products.some(p => p.quantity <= 10) && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                variants={dropdownVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="
                  absolute right-0 mt-3 w-80 md:w-96 bg-white dark:bg-slate-900 
                  border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-30 overflow-hidden
                "
              >
                <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Alert Center</h4>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400">
                    {alerts.filter(a => a.type !== 'info').length} Warning(s)
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="p-4 flex hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className={`text-xs font-bold font-sans ${
                            alert.type === 'critical' ? 'text-rose-500' : alert.type === 'warning' ? 'text-amber-500' : 'text-blue-500'
                          }`}>
                            {alert.title}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">{alert.time}</span>
                        </div>
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-normal">{alert.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Avatar Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center space-x-1 hover:opacity-85 active:scale-95 transition"
          >
            <Avatar 
              src={user?.avatar} 
              name={user?.name || 'User'} 
              size="md" 
              className="ring-2 ring-primary-500/10 cursor-pointer"
            />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                variants={dropdownVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="
                  absolute right-0 mt-3 w-64 bg-white dark:bg-slate-900 
                  border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-30 overflow-hidden
                "
              >
                <div className="px-5 py-4 bg-slate-50/50 dark:bg-slate-800/20 border-b border-slate-100 dark:border-slate-800/60 flex items-center">
                  <Avatar src={user?.avatar} name={user?.name || 'User'} size="md" />
                  <div className="ml-3 overflow-hidden">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{user?.name}</h4>
                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 truncate">{user?.email}</p>
                  </div>
                </div>
                <div className="p-1.5 space-y-0.5">
                  <Link
                    to="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-800 dark:hover:text-slate-100 transition"
                  >
                    <HiUser className="w-4 h-4 text-slate-400 dark:text-slate-500 mr-2.5" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-800 dark:hover:text-slate-100 transition"
                  >
                    <HiCog className="w-4 h-4 text-slate-400 dark:text-slate-500 mr-2.5" />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition"
                  >
                    <HiLogout className="w-4 h-4 mr-2.5" />
                    <span>Logout</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </nav>
  );
};
export default Navbar;
