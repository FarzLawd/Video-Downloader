import type { HTMLAttributes, ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Adds the bold offset shadow + border treatment (default true). */
  elevated?: boolean;
  children: ReactNode;
}
 
export default function Card({
  elevated = true,
  className = '',
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={`rounded-lg bg-surface ${
        elevated ? 'border-2 border-ink shadow-brutal' : 'border border-surface-border'
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
