/**
 * components/ui/Badge.tsx – Condition and role badge chips.
 */


import type { CharacterCondition, CharacterRole } from '../../store/types';

// ============================================================
// CONDITION BADGE
// ============================================================

const CONDITION_STYLES: Record<CharacterCondition, string> = {
  Healthy:   'bg-poison-700/40 text-poison-400 border border-poison-700/60',
  Wounded:   'bg-ember-600/30 text-ember-400 border border-ember-600/50',
  Exhausted: 'bg-gold-800/40 text-gold-400 border border-gold-700/60',
  Disabled:  'bg-blood-900/50 text-blood-300 border border-blood-700/60',
};

const CONDITION_DOTS: Record<CharacterCondition, string> = {
  Healthy:   'bg-poison-400',
  Wounded:   'bg-ember-400',
  Exhausted: 'bg-gold-400',
  Disabled:  'bg-blood-400',
};

interface ConditionBadgeProps {
  condition: CharacterCondition;
  className?: string;
}

export function ConditionBadge({ condition, className = '' }: ConditionBadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium font-body',
        'transition-all duration-300',
        CONDITION_STYLES[condition],
        className,
      ].join(' ')}
    >
      <span className={['w-1.5 h-1.5 rounded-full', CONDITION_DOTS[condition]].join(' ')} />
      {condition}
    </span>
  );
}

// ============================================================
// ROLE BADGE
// ============================================================

const ROLE_STYLES: Record<CharacterRole, string> = {
  Warrior: 'bg-blue-900/40 text-blue-300 border border-blue-700/50',
  Rogue:   'bg-green-900/40 text-green-300 border border-green-700/50',
  Mage:    'bg-arcane-900/40 text-arcane-300 border border-arcane-700/50',
  Cleric:  'bg-gold-900/40 text-gold-300 border border-gold-700/50',
};

const ROLE_ICONS: Record<CharacterRole, string> = {
  Warrior: '⚔️',
  Rogue:   '🗡️',
  Mage:    '🔮',
  Cleric:  '✨',
};

interface RoleBadgeProps {
  role: CharacterRole;
  showIcon?: boolean;
  className?: string;
}

export function RoleBadge({ role, showIcon = true, className = '' }: RoleBadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium font-body border',
        ROLE_STYLES[role],
        className,
      ].join(' ')}
    >
      {showIcon && <span className="text-xs leading-none">{ROLE_ICONS[role]}</span>}
      {role}
    </span>
  );
}

// ============================================================
// OUTCOME BADGE (OPSE result)
// ============================================================

type OutcomeType = 'StrongHit' | 'WeakHit' | 'Miss';

const OUTCOME_STYLES: Record<OutcomeType, string> = {
  StrongHit: 'bg-gold-900/50 text-gold-300 border border-gold-700/60',
  WeakHit:   'bg-ember-600/25 text-ember-300 border border-ember-600/50',
  Miss:      'bg-blood-900/50 text-blood-300 border border-blood-700/60',
};

const OUTCOME_LABELS: Record<OutcomeType, string> = {
  StrongHit: '⚡ STRONG HIT',
  WeakHit:   '⚠ WEAK HIT',
  Miss:      '✕ MISS',
};

interface OutcomeBadgeProps {
  outcome: OutcomeType;
  roll?: number;
  className?: string;
}

export function OutcomeBadge({ outcome, roll, className = '' }: OutcomeBadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold font-display tracking-wide border',
        OUTCOME_STYLES[outcome],
        className,
      ].join(' ')}
    >
      {OUTCOME_LABELS[outcome]}
      {roll !== undefined && (
        <span className="text-dungeon-400 font-mono font-normal">[{roll}]</span>
      )}
    </span>
  );
}

// ============================================================
// CHAOS FACTOR BADGE
// ============================================================

interface ChaosBadgeProps {
  value: number;
  className?: string;
}

export function ChaosBadge({ value, className = '' }: ChaosBadgeProps) {
  const isHigh = value >= 7;
  const isLow = value <= 3;
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold font-display tracking-wider border',
        isHigh
          ? 'bg-blood-900/50 text-blood-300 border-blood-700/60'
          : isLow
          ? 'bg-arcane-900/50 text-arcane-300 border-arcane-700/60'
          : 'bg-dungeon-800/60 text-dungeon-300 border-dungeon-600/60',
        className,
      ].join(' ')}
    >
      <span className="text-xs">⚡</span>
      CF {value}
    </span>
  );
}
