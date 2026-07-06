// Framer Motion Animation Variants

// Page transition animations
export const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut', when: 'beforeChildren', staggerChildren: 0.08 }
  },
  exit: { 
    opacity: 0, 
    y: -15,
    transition: { duration: 0.3, ease: 'easeIn' }
  }
};

// Staggered list container
export const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.05
    }
  }
};

// Card / Grid item animation
export const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15 }
  },
  hover: {
    y: -6,
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    transition: { duration: 0.2, ease: 'easeOut' }
  }
};

// Table row animations
export const tableRowVariants = {
  initial: { opacity: 0, x: -10 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { type: 'spring', stiffness: 120, damping: 18 }
  },
  hover: {
    backgroundColor: 'rgba(241, 245, 249, 0.6)', // light theme slate-100/60
    transition: { duration: 0.1 }
  },
  hoverDark: {
    backgroundColor: 'rgba(30, 41, 59, 0.4)', // dark theme slate-800/40
    transition: { duration: 0.1 }
  }
};

// Modal transition variants
export const modalOverlayVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2, delay: 0.1 } }
};

export const modalContentVariants = {
  initial: { scale: 0.95, opacity: 0, y: 20 },
  animate: { 
    scale: 1, 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 25 }
  },
  exit: { 
    scale: 0.95, 
    opacity: 0, 
    y: 10,
    transition: { duration: 0.2 }
  }
};

// Drawer slide-in from right
export const drawerVariants = {
  initial: { x: '100%' },
  animate: { 
    x: 0,
    transition: { type: 'spring', damping: 25, stiffness: 200 }
  },
  exit: { 
    x: '100%',
    transition: { duration: 0.2, ease: 'easeInOut' }
  }
};

// Dropdown menu animations
export const dropdownVariants = {
  initial: { opacity: 0, scale: 0.95, y: -10 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: 'spring', duration: 0.3 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: -5,
    transition: { duration: 0.15 }
  }
};

// Sidebar collapse/expand
export const sidebarVariants = {
  expanded: { 
    width: 260,
    transition: { type: 'spring', damping: 20, stiffness: 150 }
  },
  collapsed: { 
    width: 80,
    transition: { type: 'spring', damping: 20, stiffness: 150 }
  }
};

// Micro-animations for buttons
export const buttonPress = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 }
};
