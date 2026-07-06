import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowLeft } from 'react-icons/hi';
import Button from '../components/ui/Button';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-6 font-sans text-center transition-colors duration-300 overflow-hidden">
      
      {/* 404 Illustration and Text */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-6"
      >
        {/* Animated Box SVG */}
        <div className="flex justify-center">
          <svg className="w-64 h-48 text-primary-300 dark:text-primary-800 drop-shadow-md" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 20 L160 45 L100 70 L40 45 Z" className="fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-700" strokeWidth="2" strokeLinejoin="round" />
            <path d="M40 45 L40 100 L100 125 L100 70 Z" className="fill-slate-50 dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-800" strokeWidth="2" strokeLinejoin="round" />
            <path d="M100 70 L100 125 L160 100 L160 45 Z" className="fill-slate-100 dark:fill-slate-800/80 stroke-slate-300 dark:stroke-slate-700" strokeWidth="2" strokeLinejoin="round" />
            
            {/* Question Mark floating */}
            <text x="90" y="62" className="fill-primary-500 font-black text-2xl" textAnchor="middle">?</text>
          </svg>
        </div>

        <div className="space-y-2.5">
          <h1 className="text-6xl font-black text-primary-500 font-sans tracking-tight">404</h1>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-105">Page Not Found</h2>
          <p className="text-slate-450 dark:text-slate-500 text-sm font-semibold max-w-sm mx-auto leading-relaxed">
            The screen you are searching for does not exist or has been shifted. Check the URL path or return home.
          </p>
        </div>

        <div className="pt-4 flex justify-center">
          <Button
            variant="primary"
            onClick={() => navigate('/')}
            icon={<HiArrowLeft size={16} />}
          >
            Back to Dashboard
          </Button>
        </div>
      </motion.div>

    </div>
  );
};
export default NotFound;
