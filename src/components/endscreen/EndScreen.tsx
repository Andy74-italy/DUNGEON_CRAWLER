/**
 * components/endscreen/EndScreen.tsx – Victory / Defeat end screen.
 */

import { useEffect, useState } from 'react';
import { useDungeonStore } from '../../store';
import { useGameLoop } from '../../hooks/useGameLoop';
import { NarrativeSkeleton } from '../ui/Spinner';
import { Button } from '../ui/Button';
import { getSurvivors, getFallen } from '../../engine/conditions';
import { useLLM } from '../../hooks/useLLM';
import { RotateCcw, Shield, Skull } from 'lucide-react';

export function EndScreen() {
  const store = useDungeonStore();
  const { callDungeonEnd, isLoading } = useLLM();
  const { handleNewGame } = useGameLoop();
  const [endCalled, setEndCalled] = useState(false);

  const isVictory = store.gameStatus === 'VICTORY';
  const survivors = getSurvivors(store.party);
  const fallen = getFallen(store.party);

  // Call LLM end narration once
  useEffect(() => {
    if (!endCalled && !store.currentNarrative) {
      setEndCalled(true);
      void callDungeonEnd(
        isVictory ? 'VICTORY' : 'DEFEAT',
        survivors,
        fallen
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="dungeon-bg min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl space-y-8 animate-[fade-up_0.6s_ease-out] text-center">
        {/* Icon + Title */}
        <div className="space-y-4">
          <div className={[
            'w-20 h-20 mx-auto rounded-full flex items-center justify-center border-2',
            isVictory
              ? 'bg-gold-900/40 border-gold-700 shadow-[0_0_30px_8px_hsl(42_92%_52%_/_0.25)] animate-[glow-pulse_2s_ease-in-out_infinite]'
              : 'bg-blood-950/60 border-blood-800 shadow-[0_0_20px_4px_hsl(8_80%_42%_/_0.25)]',
          ].join(' ')}>
            {isVictory
              ? <Shield size={36} className="text-gold-400" />
              : <Skull size={36} className="text-blood-400" />
            }
          </div>

          <h1 className={[
            'font-decorative text-5xl font-bold leading-tight',
            isVictory ? 'text-gradient-gold' : 'text-blood-300',
          ].join(' ')}>
            {isVictory ? 'Victory!' : 'Defeat'}
          </h1>

          <p className="font-display text-dungeon-500 text-sm tracking-wide">
            {store.dungeonTheme}
          </p>
        </div>

        {/* LLM Narrative */}
        <div className="glass rounded-xl border border-dungeon-700/40 p-6 text-left">
          {isLoading ? (
            <NarrativeSkeleton />
          ) : store.currentNarrative ? (
            <p className="text-dungeon-200 leading-relaxed text-sm animate-[fade-up_0.4s_ease-out]">
              {store.currentNarrative}
            </p>
          ) : (
            <p className="text-dungeon-500 text-sm italic">
              {isVictory
                ? 'The dungeon has been conquered. Your names will be remembered.'
                : 'The darkness swallows the last ember of hope. The dungeon claims its prize.'}
            </p>
          )}
        </div>

        {/* Survivors & Fallen */}
        <div className="grid grid-cols-2 gap-4">
          {survivors.length > 0 && (
            <div className="glass-dark rounded-xl border border-poison-800/30 p-4 text-left">
              <p className="font-display text-[10px] font-semibold text-poison-500 uppercase tracking-widest mb-2">
                ✓ Survivors
              </p>
              <div className="space-y-1">
                {survivors.map((name) => (
                  <p key={name} className="text-poison-400 text-sm font-display">{name}</p>
                ))}
              </div>
            </div>
          )}
          {fallen.length > 0 && (
            <div className="glass-dark rounded-xl border border-blood-900/30 p-4 text-left">
              <p className="font-display text-[10px] font-semibold text-blood-600 uppercase tracking-widest mb-2">
                ✝ Fallen
              </p>
              <div className="space-y-1">
                {fallen.map((name) => (
                  <p key={name} className="text-blood-400 text-sm font-display">{name}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Shared loot */}
        {store.party.inventory.length > 0 && (
          <div className="glass rounded-xl border border-gold-900/30 p-4 text-left">
            <p className="font-display text-[10px] font-semibold text-gold-600 uppercase tracking-widest mb-2">
              ◈ Loot Recovered
            </p>
            <div className="flex flex-wrap gap-2">
              {store.party.inventory.map((item, i) => (
                <span key={i} className="px-2.5 py-1 bg-gold-950/40 border border-gold-900/40 rounded-lg text-gold-400 text-xs">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* New game button */}
        <Button
          id="new-game-btn"
          variant="roll"
          size="lg"
          className="w-full"
          onClick={handleNewGame}
          icon={<RotateCcw size={16} />}
        >
          Begin a New Expedition
        </Button>
      </div>
    </div>
  );
}
