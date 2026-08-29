/**
 * components/layout/GameScreen.tsx – Main 3-column dungeon gameplay screen.
 */

import { useEffect, useRef } from 'react';
import { useDungeonStore } from '../../store';
import { useGameLoop } from '../../hooks/useGameLoop';
import { PartyHUD } from '../party/PartyHUD';
import { RoomHeader } from '../dungeon/RoomHeader';
import { NarrativePanel } from '../dungeon/NarrativePanel';
import { ActionPanel } from '../dungeon/ActionPanel';
import { DiceRollModal } from '../dungeon/DiceRollModal';
import { SettingsModal } from '../settings/SettingsModal';
import { ChaosBadge } from '../ui/Badge';
import { Settings, Skull, Package } from 'lucide-react';

export function GameScreen() {
  const store = useDungeonStore();
  const { handleRoomEntry } = useGameLoop();

  const prevRoomIndex = useRef<number | null>(null);

  // Trigger LLM room intro when room changes
  useEffect(() => {
    if (
      store.activeRoom &&
      store.currentRoomIndex !== prevRoomIndex.current
    ) {
      prevRoomIndex.current = store.currentRoomIndex;
      void handleRoomEntry();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.currentRoomIndex, store.activeRoom]);

  return (
    <div className="dungeon-bg min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="glass border-b border-dungeon-800/50 px-4 py-2.5 flex items-center justify-between gap-4 z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <h1 className="font-decorative text-gold-400 text-sm font-bold tracking-widest animate-[flicker_3s_infinite]">
            ⚔ DUNGEON CRAWLER
          </h1>
          <span className="text-dungeon-700">·</span>
          <span className="font-display text-dungeon-500 text-xs truncate max-w-[200px]">
            {store.dungeonTheme}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <ChaosBadge value={store.chaosFactor} />
          <button
            id="settings-btn"
            onClick={() => store.setSettingsOpen(true)}
            className="p-2 rounded-lg text-dungeon-500 hover:text-dungeon-300 hover:bg-dungeon-800/50 transition-colors"
            title="AI Settings"
          >
            <Settings size={15} />
          </button>
          <button
            id="reset-btn"
            onClick={() => store.resetGame()}
            className="p-2 rounded-lg text-dungeon-600 hover:text-dungeon-400 hover:bg-dungeon-800/50 transition-colors"
            title="Abandon Dungeon"
          >
            <Skull size={15} />
          </button>
        </div>
      </header>

      {/* Main content: 3-column layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-5 grid grid-cols-[280px_1fr_220px] gap-5 items-start">
        {/* Left: Party HUD */}
        <div className="sticky top-[52px]">
          <PartyHUD />
        </div>

        {/* Center: Room + Narrative + Actions */}
        <div className="flex flex-col gap-4">
          <RoomHeader />
          <NarrativePanel />
          <ActionPanel />
        </div>

        {/* Right: Sidebar – loot + inventory */}
        <div className="sticky top-[52px] flex flex-col gap-3">
          {store.party.inventory.length > 0 && (
            <div className="glass rounded-xl border border-dungeon-700/40 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Package size={12} className="text-dungeon-500" />
                <h3 className="font-display text-[10px] font-semibold text-dungeon-500 uppercase tracking-widest">
                  Party Loot
                </h3>
              </div>
              <div className="flex flex-col gap-1.5">
                {store.party.inventory.map((item, i) => (
                  <div
                    key={i}
                    className="px-2.5 py-1.5 bg-gold-950/40 border border-gold-900/40 rounded-lg text-gold-400 text-xs"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Room object hint */}
          {store.activeRoom?.object && store.activeRoom.object !== 'Nothing, or mundane objects' && (
            <div className="glass-dark rounded-xl border border-dungeon-700/30 p-3">
              <p className="font-display text-[10px] font-semibold text-dungeon-600 uppercase tracking-widest mb-1.5">
                Room Object
              </p>
              <p className="text-dungeon-500 text-xs leading-relaxed">
                {store.activeRoom.object}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Overlays */}
      <DiceRollModal />
      <SettingsModal />
    </div>
  );
}
