/**
 * components/dungeon/DiceRollModal.tsx – Animated dice roll result modal.
 */

import { useEffect } from 'react';
import { useDungeonStore } from '../../store';
import { OutcomeBadge } from '../ui/Badge';

const OUTCOME_COLORS: Record<string, { face: string; glow: string; label: string }> = {
  StrongHit: {
    face: 'text-gold-300 border-gold-600',
    glow: 'shadow-[0_0_30px_8px_hsl(42_92%_52%_/_0.4)]',
    label: 'Victory favors the bold.',
  },
  WeakHit: {
    face: 'text-ember-300 border-ember-600',
    glow: 'shadow-[0_0_25px_6px_hsl(24_90%_54%_/_0.3)]',
    label: 'Success at a cost.',
  },
  Miss: {
    face: 'text-blood-300 border-blood-700',
    glow: 'shadow-[0_0_25px_6px_hsl(8_80%_42%_/_0.35)]',
    label: 'Fate turns against you.',
  },
};

const DICE_FACES: Record<number, string> = {
  1: '⚀', 2: '⚁', 3: '⚂', 4: '⚃', 5: '⚄', 6: '⚅',
};

export function DiceRollModal() {
  const { showDiceModal, lastRollResult, hideDiceRollModal } = useDungeonStore();

  // Auto-dismiss after 2.5s
  useEffect(() => {
    if (!showDiceModal) return;
    const t = setTimeout(hideDiceRollModal, 2500);
    return () => clearTimeout(t);
  }, [showDiceModal, hideDiceRollModal]);

  if (!showDiceModal || !lastRollResult) return null;

  const { outcome, roll } = lastRollResult;
  const colors = OUTCOME_COLORS[outcome];

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center pointer-events-none"
      aria-live="assertive"
      role="alert"
    >
      <div
        className={[
          'flex flex-col items-center gap-4 p-8 glass-dark rounded-2xl border pointer-events-auto',
          'animate-[roll-in_0.4s_cubic-bezier(0.34,1.56,0.64,1)]',
          colors.glow,
          colors.face,
        ].join(' ')}
        onClick={hideDiceRollModal}
        title="Click to dismiss"
      >
        {/* Dice face */}
        <div
          className={[
            'text-8xl leading-none w-32 h-32 flex items-center justify-center',
            'rounded-2xl border-2',
            colors.face,
          ].join(' ')}
        >
          {DICE_FACES[roll] ?? roll}
        </div>

        {/* Roll number */}
        <div className="text-center space-y-2">
          <p className="font-display text-sm text-dungeon-400 uppercase tracking-widest">
            You rolled
          </p>
          <p className={['font-decorative text-5xl font-bold', colors.face].join(' ')}>
            {roll}
          </p>
        </div>

        {/* Outcome badge */}
        <OutcomeBadge outcome={outcome} roll={roll} />

        {/* Flavor text */}
        <p className="text-dungeon-500 text-xs italic text-center">
          {colors.label}
        </p>
      </div>
    </div>
  );
}
