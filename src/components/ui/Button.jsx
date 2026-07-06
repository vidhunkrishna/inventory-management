import React from 'react';
import { motion } from 'framer-motion';
import { buttonPress } from '../../animations/variants';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  icon = null,
  ...props
}) => {
  const baseStyle = "inline-flex items-center justify-center font-semibold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none";
  
  const variants = {
    primary: "bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white shadow-md shadow-primary-500/20 focus:ring-primary-400",
    secondary: "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:bg-slate-300 dark:active:bg-slate-600 text-slate-700 dark:text-slate-200 focus:ring-slate-400",
    outline: "border-2 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 focus:ring-slate-400",
    danger: "bg-red-500 hover:bg-red-600 active:bg-red-700 text-white shadow-md shadow-red-500/20 focus:ring-red-400",
    ghost: "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400 focus:ring-slate-400"
  };

  const sizes = {
    sm: "px-3.5 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3.5 text-base"
  };

  return (
    <motion.button
      type={type}
      variants={buttonPress}
      whileHover={disabled ? {} : "whileHover"}
      whileTap={disabled ? {} : "whileTap"}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span className="mr-2 -ml-0.5 flex items-center">{icon}</span>}
      {children}
    </motion.button>
  );
};
export default Button;
