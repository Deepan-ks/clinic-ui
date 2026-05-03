import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility to merge tailwind classes
 */
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Heading Component
 * Uses 'Poppins' (font-display) for a modern SaaS look.
 */
export const Heading = ({ 
  level = 1, 
  variant, 
  className, 
  children, 
  ...props 
}) => {
  const Tag = `h${level}`;
  
  const variants = {
    h1: 'text-4xl font-bold font-display tracking-tight text-slate-900',
    h2: 'text-3xl font-bold font-display tracking-tight text-slate-900',
    h3: 'text-2xl font-semibold font-display tracking-tight text-slate-900',
    h4: 'text-xl font-semibold font-display tracking-tight text-slate-800',
    h5: 'text-lg font-semibold font-display text-slate-800',
    h6: 'text-base font-semibold font-display text-slate-800',
  };

  const selectedVariant = variant || `h${level}`;

  return (
    <Tag 
      className={cn(variants[selectedVariant], className)} 
      {...props}
    >
      {children}
    </Tag>
  );
};

/**
 * Text Component
 * Uses 'Inter' (font-sans) for maximum readability.
 */
export const Text = ({ 
  variant = 'base', 
  as: Tag = 'p', 
  className, 
  children, 
  ...props 
}) => {
  const variants = {
    // Body styles
    'lg': 'text-lg leading-relaxed text-slate-700',
    'base': 'text-base leading-normal text-slate-600',
    'sm': 'text-sm leading-normal text-slate-600',
    'xs': 'text-xs leading-normal text-slate-500 uppercase tracking-wider font-semibold',
    
    // Semantic roles
    'label-md': 'text-sm font-medium text-slate-700',
    'label-sm': 'text-xs font-medium text-slate-500',
    'helper': 'text-xs text-slate-400',
    
    // Data/Financials
    'number': 'font-mono tabular-nums text-slate-900',
    'number-sm': 'font-mono tabular-nums text-sm text-slate-700',
    'number-lg': 'font-mono tabular-nums text-xl font-bold text-slate-900',
  };

  return (
    <Tag 
      className={cn(variants[variant], className)} 
      {...props}
    >
      {children}
    </Tag>
  );
};
