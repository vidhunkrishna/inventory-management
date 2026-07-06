import React from 'react';
import { HiSearch, HiX } from 'react-icons/hi';
import { motion } from 'framer-motion';

export const SearchBox = ({
  value,
  onChange,
  placeholder = "Search...",
  className = '',
  onClear
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative w-full max-w-sm rounded-xl ${className}`}
    >
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
        <HiSearch size={18} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          block w-full pl-10 pr-10 py-2.5 text-sm font-medium
          bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl
          focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none
          text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500
          transition duration-150
        "
      />
      {value && (
        <button
          onClick={onClear || (() => onChange(''))}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
        >
          <HiX size={16} />
        </button>
      )}
    </motion.div>
  );
};
export default SearchBox;
