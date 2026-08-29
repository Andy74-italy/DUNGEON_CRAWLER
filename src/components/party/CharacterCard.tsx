/**
 * components/party/CharacterCard.tsx – Single party member card.
 */


import type { Character } from '../../store/types';
import { ConditionBadge, RoleBadge } from '../ui/Badge';

interface CharacterCardProps {
  character: Character;
  isHit?: boolean;  // flash animation trigger
  compact?: boolean;
}

const ROLE_BORDERS: Record<string, string> = {
  Warrior: 'border-blue-800/60 hover:border-blue-600/80',
  Rogue:   'border-green-800/60 hover:border-green-600/80',
  Mage:    'border-arcane-800/60 hover:border-arcane-600/80',
  Cleric:  'border-gold-800/60 hover:border-gold-600/80',
};

const ROLE_GLOWS: Record<string, string> = {
  Warrior: 'hover:shadow-[0_0_12px_2px_hsl(210_75%_55%_/_0.15)]',
  Rogue:   'hover:shadow-[0_0_12px_2px_hsl(148_65%_45%_/_0.15)]',
  Mage:    'hover:shadow-[0_0_12px_2px_hsl(260_70%_60%_/_0.15)]',
  Cleric:  'hover:shadow-[0_0_12px_2px_hsl(46_90%_55%_/_0.15)]',
};

const ROLE_HEADERS: Record<string, string> = {
  Warrior: 'from-blue-950 to-dungeon-900',
  Rogue:   'from-green-950 to-dungeon-900',
  Mage:    'from-arcane-950 to-dungeon-900',
  Cleric:  'from-gold-950 to-dungeon-900',
};

const CONDITION_OVERLAY: Record<string, string> = {
  Healthy:   '',
  Wounded:   'ring-1 ring-ember-600/50',
  Exhausted: 'ring-1 ring-gold-600/40',
  Disabled:  'opacity-60 ring-2 ring-blood-700/60 grayscale-[50%]',
};

export function CharacterCard({ character, isHit = false, compact = false }: CharacterCardProps) {
  const { name, role, condition, inventory } = character;

  return (
    <div
      className={[
        'relative rounded-xl border glass-light',
        'transition-all duration-300 overflow-hidden',
        ROLE_BORDERS[role],
        ROLE_GLOWS[role],
        CONDITION_OVERLAY[condition],
        isHit ? 'animate-[flash-red_0.6s_ease-out]' : '',
      ].filter(Boolean).join(' ')}
      title={character.description}
    >
      {/* Header gradient stripe */}
      <div className={['h-1 w-full bg-gradient-to-r', ROLE_HEADERS[role]].join(' ')} />

      <div className={compact ? 'p-2.5' : 'p-3'}>
        {/* Name + Roles row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <p className={[
              'font-display font-semibold text-dungeon-100 leading-tight',
              compact ? 'text-sm' : 'text-base',
            ].join(' ')}>
              {name}
            </p>
            {!compact && (
              <p className="text-dungeon-400 text-xs mt-0.5">{character.description}</p>
            )}
          </div>
          <RoleBadge role={role} showIcon={!compact} />
        </div>

        {/* Condition */}
        <div className="mb-2.5">
          <ConditionBadge condition={condition} />
        </div>

        {/* Inventory */}
        {!compact && (
          <div className="flex flex-wrap gap-1">
            {inventory.map((item, i) => (
              <span
                key={i}
                className="px-1.5 py-0.5 bg-dungeon-800/60 border border-dungeon-700/40 rounded text-dungeon-400 text-[10px] leading-tight"
                title={item}
              >
                {item}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Disabled overlay */}
      {condition === 'Disabled' && (
        <div className="absolute inset-0 flex items-center justify-center bg-dungeon-950/50 rounded-xl">
          <span className="font-display text-blood-400 text-xs font-bold tracking-widest uppercase">
            Disabled
          </span>
        </div>
      )}
    </div>
  );
}
