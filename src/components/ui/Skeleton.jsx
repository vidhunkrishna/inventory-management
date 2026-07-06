import React from 'react';

// Common shimmer classes
const shimmerClass = "relative overflow-hidden bg-slate-200 dark:bg-slate-800 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 dark:before:via-white/5 before:to-transparent";

export const CardSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl ${shimmerClass}`}></div>
            <div className={`w-8 h-4 rounded ${shimmerClass}`}></div>
          </div>
          <div className={`w-24 h-4 rounded mb-2 ${shimmerClass}`}></div>
          <div className={`w-32 h-8 rounded ${shimmerClass}`}></div>
        </div>
      ))}
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 6 }) => {
  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <div className={`w-48 h-8 rounded-lg ${shimmerClass}`}></div>
        <div className="flex space-x-3">
          <div className={`w-24 h-8 rounded-lg ${shimmerClass}`}></div>
          <div className={`w-24 h-8 rounded-lg ${shimmerClass}`}></div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50">
              {Array.from({ length: cols }).map((_, i) => (
                <th key={i} className="px-6 py-4">
                  <div className={`w-20 h-4 rounded ${shimmerClass}`}></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
                {Array.from({ length: cols }).map((_, j) => (
                  <td key={j} className="px-6 py-4">
                    <div className={`w-full max-w-[120px] h-4 rounded ${shimmerClass}`}></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const ChartSkeleton = () => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div className={`w-40 h-6 rounded ${shimmerClass}`}></div>
        <div className={`w-20 h-4 rounded ${shimmerClass}`}></div>
      </div>
      <div className="flex items-end justify-between h-64 px-4 pt-4 border-b border-l border-slate-100 dark:border-slate-800">
        {[45, 80, 55, 90, 70, 60, 85].map((height, i) => (
          <div 
            key={i} 
            className={`w-[10%] rounded-t ${shimmerClass}`} 
            style={{ height: `${height}%` }}
          ></div>
        ))}
      </div>
    </div>
  );
};
export default CardSkeleton;
