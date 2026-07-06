import React from 'react';

export const Badge = ({ children, variant, className = '' }) => {
  const getBadgeStyle = () => {
    const term = (variant || children || '').toString().toLowerCase().trim();

    switch (term) {
      case 'in stock':
      case 'active':
      case 'active supplier':
      case 'stock in':
      case 'completed':
      case 'green':
        return 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30';
      
      case 'low stock':
      case 'pending':
      case 'orange':
      case 'warning':
        return 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30';
      
      case 'out of stock':
      case 'inactive':
      case 'cancelled':
      case 'stock out':
      case 'red':
      case 'danger':
        return 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30';
      
      case 'primary':
      case 'blue':
        return 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30';

      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full select-none ${getBadgeStyle()} ${className}`}>
      {children}
    </span>
  );
};
export default Badge;
