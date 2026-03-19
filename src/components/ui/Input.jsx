import { forwardRef } from 'react';

/**
 * Dark-themed input with label and optional error message.
 */
const Input = forwardRef(function Input(
  {
    label,
    error,
    id,
    className = '',
    required = false,
    ...props
  },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-white/80"
        >
          {label}
          {required && <span className="text-[#E8FF3A] ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={[
          'w-full rounded-xl bg-[#0F3460] border border-white/10 text-white placeholder:text-white/30',
          'px-4 py-2.5 text-sm min-h-[44px]',
          'focus:outline-none focus:border-[#E8FF3A] focus:ring-1 focus:ring-[#E8FF3A]',
          'transition-colors duration-150',
          error ? 'border-red-500 focus:border-red-400 focus:ring-red-400' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} role="alert" className="text-xs text-red-400 flex items-center gap-1">
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
    </div>
  );
});

export default Input;
