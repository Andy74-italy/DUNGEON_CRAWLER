/**
 * components/dungeon/RoomHeader.tsx – Room info bar with dungeon progress tracker.
 */

import React from 'react';
import { useDungeonStore } from '../../store';
import { ChaosBadge } from '../ui/Badge';
import { MapPin, CheckCircle, Lock } from 'lucide-react';

export function RoomHeader() {
  const { activeRoom, currentRoomIndex, totalRooms, dungeonTheme, chaosFactor, dungeonRooms } =
    useDungeonStore();

  if (!activeRoom) return null;

  return (
    <div className="glass rounded-xl border border-dungeon-700/40 p-4 space-y-3">
      {/* Dungeon theme */}
      <div className="flex items-center gap-2">
        <MapPin size={12} className="text-dungeon-500 shrink-0" />
        <p className="font-display text-dungeon-400 text-xs tracking-wide truncate">
          {dungeonTheme}
        </p>
      </div>

      {/* Room title + CF */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-semibold text-dungeon-100 text-lg leading-tight">
            Room {activeRoom.roomNumber}
            <span className="text-dungeon-500 font-normal">/{totalRooms}</span>
          </h1>
          <p className="text-dungeon-400 text-sm mt-0.5 capitalize">
            {activeRoom.type}
          </p>
        </div>
        <ChaosBadge value={chaosFactor} />
      </div>

      {/* Dungeon progress track */}
      <div className="flex items-center gap-1.5">
        {Array.from({ length: totalRooms }, (_, i) => {
          const room = dungeonRooms[i];
          const isCurrent = i === currentRoomIndex;
          const isCleared = room?.cleared;
          const isLocked = i > currentRoomIndex;
          const isBoss = i === totalRooms - 1;

          return (
            <React.Fragment key={i}>
              <div
                className={[
                  'flex items-center justify-center w-7 h-7 rounded-full border text-[10px] font-bold font-display transition-all duration-300',
                  isCurrent
                    ? 'bg-gold-800/60 border-gold-600 text-gold-200 shadow-[0_0_8px_2px_hsl(42_92%_52%_/_0.3)]'
                    : isCleared
                    ? 'bg-poison-700/40 border-poison-600/60 text-poison-400'
                    : isLocked
                    ? 'bg-dungeon-900/60 border-dungeon-700/40 text-dungeon-600'
                    : 'bg-dungeon-800 border-dungeon-600 text-dungeon-300',
                  isBoss && !isLocked ? 'border-blood-700/80' : '',
                ].join(' ')}
                title={room ? `Room ${i + 1}: ${room.type}` : `Room ${i + 1}`}
              >
                {isCleared ? (
                  <CheckCircle size={12} className="text-poison-400" />
                ) : isLocked ? (
                  <Lock size={10} className="text-dungeon-600" />
                ) : isBoss ? (
                  '☠'
                ) : (
                  i + 1
                )}
              </div>

              {/* Connector line */}
              {i < totalRooms - 1 && (
                <div
                  className={[
                    'h-0.5 flex-1 rounded-full transition-all duration-500',
                    isCleared ? 'bg-poison-700/60' : 'bg-dungeon-700/40',
                  ].join(' ')}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Encounter info */}
      {activeRoom.hazard && activeRoom.hazard !== 'None' && (
        <div className="flex items-center gap-2">
          <span className="text-blood-500 text-xs">⚠</span>
          <span className="text-dungeon-400 text-xs">
            <span className="text-dungeon-500">Hazard:</span> {activeRoom.hazard}
          </span>
        </div>
      )}
    </div>
  );
}
