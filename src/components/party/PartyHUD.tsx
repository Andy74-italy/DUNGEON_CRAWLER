/**
 * components/party/PartyHUD.tsx – 4-character party status display.
 */


import { useDungeonStore } from '../../store';
import { CharacterCard } from './CharacterCard';
import { Users } from 'lucide-react';

export function PartyHUD() {
  const { party, recentlyHitMemberIds } = useDungeonStore();

  return (
    <aside className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center gap-2 px-1">
        <Users size={14} className="text-dungeon-400" />
        <h2 className="font-display text-xs font-semibold text-dungeon-400 uppercase tracking-widest">
          Party
        </h2>
      </div>

      {/* Character cards */}
      <div className="flex flex-col gap-2">
        {party.members.map((member) => (
          <CharacterCard
            key={member.id}
            character={member}
            isHit={recentlyHitMemberIds.includes(member.id)}
          />
        ))}
      </div>

      {/* Shared inventory */}
      {party.inventory.length > 0 && (
        <div className="mt-1 p-3 glass-dark rounded-lg border border-dungeon-700/40">
          <p className="font-display text-[10px] font-semibold text-dungeon-500 uppercase tracking-widest mb-2">
            Shared Loot
          </p>
          <div className="flex flex-wrap gap-1">
            {party.inventory.map((item, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-gold-900/30 border border-gold-800/40 rounded text-gold-400 text-xs"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
