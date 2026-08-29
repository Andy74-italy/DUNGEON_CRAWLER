/**
 * components/ui/Spinner.tsx – Loading spinner with dungeon theme.
 */

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_MAP = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' };
const BORDER_MAP = { sm: 'border-2', md: 'border-2', lg: 'border-3' };

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={[
        'block rounded-full border-dungeon-600 border-t-gold-500 animate-spin',
        SIZE_MAP[size],
        BORDER_MAP[size],
        className,
      ].join(' ')}
    />
  );
}

/**
 * Full-area skeleton loader for the narrative panel.
 */
export function NarrativeSkeleton() {
  return (
    <div className="space-y-3 animate-pulse" aria-hidden="true">
      <div className="h-4 bg-dungeon-700/60 rounded-md w-full" />
      <div className="h-4 bg-dungeon-700/60 rounded-md w-5/6" />
      <div className="h-4 bg-dungeon-700/60 rounded-md w-4/5" />
      <div className="h-4 bg-dungeon-700/60 rounded-md w-full" />
      <div className="h-4 bg-dungeon-700/60 rounded-md w-3/4" />
    </div>
  );
}
