import React from 'react';

export const Input = React.forwardRef(({
  label,
  type = 'text',
  error,
  helperText,
  icon,
  className = '',
  id,
  required = false,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full text-left">
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 font-sans"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative rounded-xl shadow-sm">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          id={inputId}
          required={required}
          className={`
            block w-full rounded-xl text-sm font-medium transition-all duration-200
            border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50
            focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
            disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-950
            placeholder-slate-400 dark:placeholder-slate-500 text-slate-800 dark:text-slate-100
            ${icon ? 'pl-10' : 'pl-4'} 
            ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border'}
            py-2.5 ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-500 font-medium font-sans">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500 font-sans">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
