import React from 'react';
import { motion } from 'framer-motion';
import { cardVariants } from '../../animations/variants';

export const EmptyState = ({ 
  title = "No Data Found", 
  description = "There are no records to display at the moment.", 
  actionText = "", 
  onActionClick = null,
  iconType = "box" 
}) => {
  
  // Custom SVG Illustrations
  const renderIllustration = () => {
    switch (iconType) {
      case "suppliers":
        return (
          <svg className="w-48 h-36 text-primary-300 dark:text-primary-800" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="30" y="40" width="140" height="80" rx="12" className="fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-700" strokeWidth="2"/>
            <circle cx="70" cy="80" r="16" className="fill-primary-100 dark:fill-primary-900/30 stroke-primary-400 dark:stroke-primary-500" strokeWidth="2" />
            <line x1="96" y1="72" x2="140" y2="72" className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="3" strokeLinecap="round" />
            <line x1="96" y1="88" x2="124" y2="88" className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="3" strokeLinecap="round" />
            <circle cx="170" cy="40" r="10" className="fill-emerald-100 dark:fill-emerald-900/30 stroke-emerald-400 dark:stroke-emerald-500" strokeWidth="2" />
            <circle cx="30" cy="110" r="6" className="fill-amber-100 dark:fill-amber-900/30 stroke-amber-400 dark:stroke-amber-500" strokeWidth="2" />
          </svg>
        );
      case "inventory":
        return (
          <svg className="w-48 h-36 text-primary-300 dark:text-primary-800" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="40" y="30" width="120" height="90" rx="8" className="fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-700" strokeWidth="2"/>
            <path d="M60 55 L90 55 M60 75 L110 75 M60 95 L140 95" className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="3" strokeLinecap="round"/>
            <path d="M120 45 L150 75 L120 75 Z" className="fill-primary-100 dark:fill-primary-900/30 stroke-primary-400 dark:stroke-primary-500" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="150" cy="75" r="4" className="fill-primary-500" />
          </svg>
        );
      case "box":
      default:
        return (
          <svg className="w-48 h-36 text-primary-300 dark:text-primary-800" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Box Lid */}
            <path d="M100 20 L160 45 L100 70 L40 45 Z" className="fill-primary-100 dark:fill-primary-900/20 stroke-primary-400 dark:stroke-primary-500" strokeWidth="2" strokeLinejoin="round" />
            {/* Box Front Left */}
            <path d="M40 45 L40 100 L100 125 L100 70 Z" className="fill-slate-50 dark:fill-slate-900 stroke-slate-300 dark:stroke-slate-700" strokeWidth="2" strokeLinejoin="round" />
            {/* Box Front Right */}
            <path d="M100 70 L100 125 L160 100 L160 45 Z" className="fill-slate-100 dark:fill-slate-800 stroke-slate-400 dark:stroke-slate-600" strokeWidth="2" strokeLinejoin="round" />
            {/* Inner box line shadow */}
            <path d="M100 70 L100 120" className="stroke-primary-300 dark:stroke-primary-700" strokeWidth="2" />
            {/* Floating details */}
            <path d="M30 35 Q35 20 50 25" className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="2" strokeLinecap="round" />
            <circle cx="165" cy="30" r="3" className="fill-amber-400" />
            <circle cx="175" cy="90" r="5" className="fill-emerald-400" />
          </svg>
        );
    }
  };

  return (
    <motion.div 
      variants={cardVariants}
      initial="initial"
      animate="animate"
      className="flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm min-h-[400px]"
    >
      <div className="mb-6 flex justify-center w-full">
        {renderIllustration()}
      </div>
      <h3 className="text-xl font-bold font-sans text-slate-800 dark:text-slate-200 mb-2">
        {title}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-sm text-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onActionClick && (
        <button
          onClick={onActionClick}
          className="px-5 py-2.5 bg-primary-500 hover:bg-primary-600 active:scale-95 text-white font-medium text-sm rounded-xl transition duration-150 shadow-sm shadow-primary-500/25 flex items-center space-x-2"
        >
          <span>{actionText}</span>
        </button>
      )}
    </motion.div>
  );
};
export default EmptyState;
