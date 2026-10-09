'use client';

import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
 
type Variant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'link';

type Size = 'small' | 'medium' | 'large';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

const base =
  'inline-flex items-center justify-center gap-2 font-bold select-none rounded-md transition-all duration-150 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface ' +
  'disabled:cursor-not-allowed disabled:opacity-60';

const variants: Record<Variant, string> = {
  primary:
    'bg-brand text-white border-2 border-ink shadow-brutal hover:bg-brand-hover hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none',
  secondary:
    'bg-accent-yellow text-ink border-2 border-ink shadow-brutal hover:bg-accent-yellow-hover hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none',
  accent:
    'bg-accent-pink text-ink border-2 border-ink shadow-brutal hover:bg-accent-pink-soft hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none',
  outline:
    'bg-surface text-ink border-2 border-ink shadow-brutal hover:bg-surface-muted hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none',
  ghost:
    'bg-transparent text-ink hover:bg-surface-muted active:bg-surface-border',
  destructive:
    'bg-semantic-error text-white border-2 border-ink shadow-brutal hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none',
  link: 'bg-transparent text-brand p-0 h-auto shadow-none hover:underline underline-offset-2',
};

const sizes: Record<Size, string> = {
  small: 'h-9 px-3 text-sm',
  medium: 'h-11 px-5 text-sm',
  large: 'h-12 px-6 text-base',
};

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'medium',
      loading = false,
      fullWidth = false,
      disabled,
      children,
      className = '',
      ...rest
    },
    ref,
  ) {
    const isLink = variant === 'link';
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${base} ${variants[variant]} ${sizes[size]} ${
          fullWidth ? 'w-full' : ''
        } ${isLink ? 'p-0' : ''} ${className}`}
        {...rest}
      >
        {loading && <Spinner />}
        {children}
      </button>
    );
  },
);

export default Button;
