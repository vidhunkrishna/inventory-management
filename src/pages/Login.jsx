import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen w-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-sans overflow-hidden">
      
      {/* Left side Form Container */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-6 md:px-16 lg:px-20 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800/60 shadow-2xl z-10">
        <div className="max-w-md w-full mx-auto">
          {/* Logo Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-3 mb-8"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-primary-400 text-white font-extrabold text-xl shadow-md shadow-primary-500/25">
              I
            </div>
            <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
              Invento<span className="text-primary-500 font-semibold">SaaS</span>
            </span>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
              Welcome back
            </h2>
            <p className="text-sm font-semibold text-slate-400 dark:text-slate-500 mt-2">
              Log in to manage your real-time inventory assets.
            </p>
          </motion.div>

          {/* Login Form */}
          <motion.form
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-500 text-xs font-semibold border border-rose-100 dark:border-rose-900/30">
                {error}
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<HiMail size={18} />}
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<HiLockClosed size={18} />}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-[38px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
              >
                {showPassword ? <HiEyeOff size={18} /> : <HiEye size={18} />}
              </button>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs font-semibold">
              <label className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-800 text-primary-500 focus:ring-primary-500/20 focus:ring-offset-0 transition"
                />
                <span>Remember me</span>
              </label>
              <button 
                type="button" 
                className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                onClick={() => alert('Demo Feature: In a production app, this will trigger a password reset link.')}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Authenticating...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </motion.form>

          {/* Credentials box tip */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60"
          >
            <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Demo Credentials:</h5>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Email: <span className="text-primary-500">admin@example.com</span>
            </p>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Password: <span className="text-primary-500">password123</span>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right side Illustration / Background */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-tr from-slate-900 via-slate-950 to-slate-900 items-center justify-center p-12 relative">
        {/* Glow Circles */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary-500/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px]" />
        
        {/* Graphic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-xl text-center text-white"
        >
          {/* Isometric Dashboard Illustration */}
          <svg className="w-80 h-64 mx-auto mb-8 text-primary-400 drop-shadow-[0_15px_15px_rgba(14,165,233,0.15)]" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 20 L180 60 L100 100 L20 60 Z" className="fill-slate-800/50 stroke-primary-400" strokeWidth="2" />
            <path d="M20 60 L20 110 L100 150 L100 100 Z" className="fill-slate-900/60 stroke-primary-500/80" strokeWidth="2" />
            <path d="M100 100 L100 150 L180 110 L180 60 Z" className="fill-slate-800/80 stroke-primary-600/80" strokeWidth="2" />
            
            {/* Inner graphics */}
            <circle cx="100" cy="60" r="15" className="fill-primary-500/30 stroke-primary-300 animate-pulse" strokeWidth="1.5" />
            <line x1="60" y1="40" x2="80" y2="50" className="stroke-slate-500" strokeWidth="2" />
            <line x1="140" y1="40" x2="120" y2="50" className="stroke-slate-500" strokeWidth="2" />
            
            {/* Float blocks */}
            <path d="M50 85 L80 100 L80 115 L50 100 Z" className="fill-emerald-400/80" />
            <path d="M120 95 L150 110 L150 125 L120 110 Z" className="fill-amber-400/80" />
          </svg>

          <h3 className="text-3xl font-extrabold font-sans mb-3">
            Analyze, Track & Replenish.
          </h3>
          <p className="text-slate-400 text-sm font-semibold max-w-sm mx-auto leading-relaxed">
            A beautiful unified workspace designed to optimize modern SaaS inventory operations.
          </p>
        </motion.div>
      </div>

    </div>
  );
};
export default Login;
