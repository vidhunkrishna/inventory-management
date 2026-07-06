import React from 'react';
import { motion } from 'framer-motion';
import { pageVariants } from '../../animations/variants';

export const PageWrapper = ({ children, className = '' }) => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`p-6 max-w-7xl mx-auto w-full min-h-[calc(100vh-5rem)] flex flex-col ${className}`}
    >
      {children}
    </motion.div>
  );
};
export default PageWrapper;
