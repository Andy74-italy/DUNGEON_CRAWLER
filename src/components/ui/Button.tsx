/**
 * components/ui/Button.tsx – Reusable button with dark-fantasy variants.
 */

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'ghost' | 'roll' | 'gold' | 'arcane';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

const VARIANT_CLASSES: Record<string, string> = {
  primary:
    'bg-dungeon-700 hover:bg-dungeon-600 border border-dungeon-500 hover:border-dungeon-400 text-dungeon-100 hover:text-white',
  danger:
    'bg-blood-900 hover:bg-blood-800 border border-blood-700 hover:border-blood-600 text-blood-200 hover:text-white',
  ghost:
    'bg-transparent hover:bg-dungeon-800 border border-dungeon-600 hover:border-dungeon-500 text-dungeon-300 hover:text-dungeon-100',
  roll:
    'bg-gradient-to-br from-gold-700 to-gold-900 hover:from-gold-600 hover:to-gold-800 border border-gold-600 hover:border-gold-500 text-gold-100 hover:text-white font-semibold shadow-[0_0_12px_2px_hsl(42_92%_52%_/_0.2)] hover:shadow-[0_0_18px_4px_hsl(42_92%_52%_/_0.35)]',
  gold:
    'bg-gradient-to-br from-gold-800 to-gold-950 hover:from-gold-700 hover:to-gold-900 border border-gold-700 text-gold-200 hover:text-gold-100',
  arcane:
    'bg-gradient-to-br from-arcane-800 to-arcane-950 hover:from-arcane-700 hover:to-arcane-900 border border-arcane-700 hover:border-arcane-600 text-arcane-200 hover:text-arcane-100',
};

const SIZE_CLASSES: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-md gap-1.5',
  md: 'px-4 py-2 text-sm rounded-lg gap-2',
  lg: 'px-6 py-3 text-base rounded-lg gap-2.5',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center font-body font-medium',
        'transition-all duration-200 cursor-pointer select-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dungeon-900',
        'active:scale-95',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        isDisabled ? 'opacity-40 cursor-not-allowed active:scale-100' : '',
        className,
      ].filter(Boolean).join(' ')}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
