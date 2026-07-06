import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChevronDown } from 'react-icons/hi';
import { dropdownVariants } from '../../animations/variants';

export const Dropdown = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select option",
  className = '',
  icon = null
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if user clicks outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`relative text-left ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 font-sans">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium
          bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl
          focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20
          text-slate-700 dark:text-slate-200 transition duration-150 active:scale-[0.99]
        "
      >
        <span className="flex items-center space-x-2">
          {icon && <span className="text-slate-400">{icon}</span>}
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
        </span>
        <HiChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute z-30 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto"
          >
            <div className="py-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full text-left px-4 py-2.5 text-sm font-medium transition duration-150 flex items-center justify-between
                    ${value === option.value 
                      ? 'bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400' 
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }
                  `}
                >
                  {option.label}
                  {value === option.value && <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default Dropdown;
