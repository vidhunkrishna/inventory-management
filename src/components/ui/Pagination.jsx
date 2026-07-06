import React from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = ''
}) => {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`
            w-9 h-9 rounded-xl text-sm font-semibold transition-all duration-150 flex items-center justify-center
            ${currentPage === i 
              ? 'bg-primary-500 text-white shadow-md shadow-primary-500/25' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 active:scale-95'
            }
          `}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className={`flex items-center justify-between py-4 px-6 border-t border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/30 rounded-b-2xl ${className}`}>
      <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
        Page {currentPage} of {totalPages}
      </span>
      <div className="flex items-center space-x-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800/80 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <HiChevronLeft size={16} />
        </button>
        {renderPageNumbers()}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800/80 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <HiChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
export default Pagination;
