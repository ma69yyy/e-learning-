import React from 'react';

const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 select-none tracking-[-0.01em]';

const sizeStyles = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2.5'
};

const variantStyles = {
  primary: 'bg-[#183a68] hover:bg-[#102b50] text-white focus:ring-[#183a68] shadow-[0_8px_18px_rgba(24,58,104,.18)] active:bg-[#0b203b]',
  secondary: 'bg-[#172033] hover:bg-[#0c1320] text-white focus:ring-slate-700 active:bg-black',
  outline: 'border border-[#cbd5e1] bg-white hover:bg-[#f2f6fb] text-[#263b59] focus:ring-[#183a68]',
  danger: 'bg-[#8f3040] hover:bg-[#742635] text-white focus:ring-rose-500 shadow-sm active:bg-[#5e1e2b]',
  success: 'bg-[#1d765e] hover:bg-[#155d4b] text-white focus:ring-emerald-500 shadow-sm active:bg-[#104637]',
  ghost: 'bg-transparent hover:bg-slate-100 text-slate-700 focus:ring-slate-300'
};

export const buttonClassName = (variant = 'primary', size = 'md', className = '') =>
  `${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`;

/**
 * Reusable Button component with multiple variants, sizes, and states
 */
const Button = ({
  children,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'ghost'
  size = 'md',         // 'sm' | 'md' | 'lg'
  disabled = false,
  isLoading = false,
  icon = null,
  onClick,
  className = '',
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={buttonClassName(variant, size, className)}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!isLoading && icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export default Button;
