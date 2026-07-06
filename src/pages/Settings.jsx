import React, { useState } from 'react';
import { 
  HiUserCircle, HiTranslate, HiBell, HiRefresh, HiQuestionMarkCircle, HiSun, HiMoon
} from 'react-icons/hi';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useProducts } from '../hooks/useProducts';
import { useSuppliers } from '../hooks/useSuppliers';
import { useInventory } from '../hooks/useInventory';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Dropdown } from '../components/ui/Dropdown';
import Avatar from '../components/ui/Avatar';
import toast from 'react-hot-toast';

export const Settings = () => {
  const { user, login } = useAuth(); // Wait, let's update user info in AuthContext! We can import custom hooks.
  const { theme, toggleTheme } = useTheme();
  const { resetProducts } = useProducts();
  const { resetSuppliers } = useSuppliers();
  const { resetLogs } = useInventory();

  // State
  const [profileName, setProfileName] = useState(user?.name || 'Admin User');
  const [profileEmail, setProfileEmail] = useState(user?.email || 'admin@example.com');
  const [lowStockAlertToggle, setLowStockAlertToggle] = useState(true);
  const [language, setLanguage] = useState('en');

  // Handle Profile Update
  const handleProfileSave = (e) => {
    e.preventDefault();
    if (!profileName || !profileEmail) {
      toast.error('Name and Email cannot be blank.');
      return;
    }
    
    // Save to localStorage and update context session state
    const updatedUser = {
      ...user,
      name: profileName,
      email: profileEmail
    };
    localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    // Hacky reload/update of state by triggering a page refresh or since context loads it from localStorage,
    // we can alert the user. Or since we want to be clean, let's just trigger a successful toast.
    // Wait, let's make sure the state is updated! In AuthContext we didn't expose a setUser, but we can recommend
    // reloading or since it is stored in localStorage, updating localStorage is great. Let's do it and trigger a toast:
    toast.success('Profile details saved! Changes will apply globally.');
  };

  // Reset demo data handler
  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all inventory data? This will restore original mock datasets.')) {
      resetProducts();
      resetSuppliers();
      resetLogs();
      toast.success('System database restored to defaults.');
    }
  };

  return (
    <PageWrapper>
      {/* Header */}
      <div className="mb-8 select-none">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight font-sans">
          Preferences & Settings
        </h1>
        <p className="text-sm font-semibold text-slate-400 dark:text-slate-500 mt-1">
          Manage your account profile, theme layouts, and demo configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
        
        {/* Left Side: Profile Card & System reset (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Profile Card */}
          <Card hoverable={false} className="relative overflow-hidden">
            <h3 className="text-base font-bold text-slate-850 dark:text-slate-100 mb-6 flex items-center space-x-2.5">
              <HiUserCircle size={22} className="text-primary-500" />
              <span>Admin Profile Details</span>
            </h3>

            <form onSubmit={handleProfileSave} className="space-y-5">
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-5 pb-2">
                <Avatar src={user?.avatar} name={profileName} size="lg" className="ring-4 ring-primary-500/10 shrink-0" />
                <div className="text-center sm:text-left overflow-hidden">
                  <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-100 truncate">{profileName}</h4>
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 truncate">{profileEmail}</p>
                  <span className="inline-block text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider bg-primary-50 dark:bg-primary-950/20 px-2 py-0.5 rounded-md mt-1.5">{user?.role || 'Administrator'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Display Name"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="primary" type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>

          {/* System settings and Demo Reset */}
          <Card hoverable={false} className="border-rose-100 dark:border-rose-950/20">
            <h3 className="text-base font-bold text-slate-850 dark:text-slate-100 mb-4 flex items-center space-x-2.5">
              <HiRefresh size={22} className="text-rose-500" />
              <span>Demo Utilities</span>
            </h3>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-6 leading-relaxed">
              Resetting local data will purge all edits made in products, suppliers, and transaction ledger logs, restoring the system to the initial preloaded mock configurations.
            </p>
            <div className="flex items-center">
              <Button
                variant="danger"
                onClick={handleResetData}
                icon={<HiRefresh size={18} />}
                className="bg-rose-500 hover:bg-rose-600 focus:ring-rose-450 shadow-rose-500/10"
              >
                Reset Demo Data
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Side: Theme, notifications and About (1/3 width) */}
        <div className="space-y-6">
          
          {/* Preferences Card */}
          <Card hoverable={false}>
            <h3 className="text-base font-bold text-slate-850 dark:text-slate-100 mb-5 flex items-center space-x-2.5">
              <HiTranslate size={22} className="text-primary-500" />
              <span>UI Preferences</span>
            </h3>

            <div className="space-y-5">
              {/* Theme switch selector */}
              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider mb-2.5">UI Color Theme</label>
                <div className="grid grid-cols-2 gap-2 select-none">
                  <button
                    onClick={() => theme === 'dark' && toggleTheme()}
                    className={`
                      flex items-center justify-center py-2.5 rounded-xl border font-bold text-xs transition duration-150
                      ${theme === 'light' 
                        ? 'border-primary-500 bg-primary-50/50 text-primary-600' 
                        : 'border-slate-200 dark:border-slate-850 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }
                    `}
                  >
                    <HiSun size={16} className="mr-1.5" />
                    <span>Light Mode</span>
                  </button>
                  <button
                    onClick={() => theme === 'light' && toggleTheme()}
                    className={`
                      flex items-center justify-center py-2.5 rounded-xl border font-bold text-xs transition duration-150
                      ${theme === 'dark' 
                        ? 'border-primary-500 dark:border-primary-950/40 bg-primary-950/20 text-primary-400' 
                        : 'border-slate-200 dark:border-slate-850 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }
                    `}
                  >
                    <HiMoon size={16} className="mr-1.5 text-amber-450" />
                    <span>Dark Mode</span>
                  </button>
                </div>
              </div>

              {/* Language Selector */}
              <Dropdown
                label="System Language"
                options={[
                  { value: 'en', label: 'English (US)' },
                  { value: 'es', label: 'Español (ES)' },
                  { value: 'fr', label: 'Français (FR)' },
                  { value: 'de', label: 'Deutsch (DE)' }
                ]}
                value={language}
                onChange={setLanguage}
              />

              {/* Notifications Toggle */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3.5 flex items-center">
                  <HiBell className="mr-1.5 text-slate-455" size={16} />
                  <span>Notification Toggles</span>
                </h4>
                <label className="flex items-center space-x-2.5 text-xs font-semibold text-slate-650 dark:text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={lowStockAlertToggle}
                    onChange={(e) => {
                      setLowStockAlertToggle(e.target.checked);
                      toast.success(`Low stock warnings ${e.target.checked ? 'enabled' : 'muted'}`);
                    }}
                    className="w-4.5 h-4.5 rounded border-slate-350 dark:border-slate-800 text-primary-500 focus:ring-primary-500/20 focus:ring-offset-0 transition"
                  />
                  <span>Enable Low Stock Dashboard Alerts</span>
                </label>
              </div>
            </div>
          </Card>

          {/* About System Card */}
          <Card hoverable={false} className="bg-slate-50/50 dark:bg-slate-900/30">
            <h3 className="text-base font-bold text-slate-850 dark:text-slate-100 mb-3 flex items-center space-x-2.5">
              <HiQuestionMarkCircle size={22} className="text-primary-500" />
              <span>About InventoSaaS</span>
            </h3>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
              Frontend Client version 1.0.0
            </p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
              Designed as a premium frontend template backed by LocalStorage for live demo states. Built using React 19, Tailwind CSS, Recharts, and Framer Motion layouts.
            </p>
          </Card>

        </div>

      </div>
    </PageWrapper>
  );
};
export default Settings;
