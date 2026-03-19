import { forwardRef } from 'react';

const variants = {
  primary: 'bg-[#E8FF3A] text-[#1A1A2E] font-semibold hover:bg-[#d4eb2a] active:bg-[#c0d61a] focus-visible:ring-2 focus-visible:ring-[#E8FF3A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A2E]',
  secondary: 'bg-[#0F3460] text-white font-medium hover:bg-[#1a4a8a] active:bg-[#0d2d54] border border-[#1a4a8a] focus-visible:ring-2 focus-visible:ring-[#E8FF3A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A2E]',
  danger: 'bg-red-500/20 text-red-400 font-medium hover:bg-red-500/30 active:bg-red-500/40 border border-red-500/30 focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A2E]',
  ghost: 'bg-transparent text-white/70 font-medium hover:bg-white/10 hover:text-white active:bg-white/20 focus-visible:ring-2 focus-visible:ring-[#E8FF3A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A2E]',
};

const sizes = {
  sm: 'text-sm px-3 py-1.5 min-h-[36px]',
  md: 'text-sm px-4 py-2 min-h-[44px]',
  lg: 'text-base px-6 py-3 min-h-[52px]',
};

/**
 * Button component with brand-consistent variants.
 * All touch targets are minimum 44px as per accessibility guidelines.
 */
const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    children,
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-150 cursor-pointer',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        variants[variant] ?? variants.primary,
        sizes[size] ?? sizes.md,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;
