import React from 'react';
import { motion } from 'framer-motion';
import { cardVariants } from '../../animations/variants';

export const Card = ({
  children,
  className = '',
  hoverable = true,
  glow = false,
  onClick,
  ...props
}) => {
  const baseClasses = "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm";
  const hoverClasses = hoverable ? "cursor-pointer" : "";
  const glowClasses = glow ? "glow-card" : "";

  if (hoverable || onClick) {
    return (
      <motion.div
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        onClick={onClick}
        className={`${baseClasses} ${hoverClasses} ${glowClasses} ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${baseClasses} ${glowClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};
export default Card;
