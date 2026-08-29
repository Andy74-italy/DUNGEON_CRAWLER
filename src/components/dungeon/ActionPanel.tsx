/**
 * components/dungeon/ActionPanel.tsx – Player action input and suggested actions.
 */

import React, { useState, useRef } from 'react';
import { useDungeonStore } from '../../store';
import { useGameLoop } from '../../hooks/useGameLoop';
import { Button } from '../ui/Button';
import { OutcomeBadge } from '../ui/Badge';
import { Send, ChevronRight, Swords } from 'lucide-react';

export function ActionPanel() {
  const {
    suggestedActions,
    isLLMLoading,
    activeRoom,
    gameStatus,
    lastRollResult,
  } = useDungeonStore();

  const { handlePlayerAction, handleAdvanceRoom, isProcessing } = useGameLoop();

  const [customAction, setCustomAction] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isActive = gameStatus === 'EXPLORING' || gameStatus === 'IN_COMBAT';
  const isDisabled = isLLMLoading || isProcessing || !isActive;
  const isRoomCleared = activeRoom?.cleared ?? false;

  const handleSubmit = async (action: string) => {
    if (!action.trim() || isDisabled) return;
    await handlePlayerAction(action.trim());
    setCustomAction('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit(customAction);
    }
  };

  return (
    <div className="glass rounded-xl border border-dungeon-700/40 p-4 space-y-4">
      {/* Last roll result */}
      {lastRollResult && (
        <div className="flex items-center gap-2 animate-[fade-up_0.3s_ease-out]">
          <OutcomeBadge outcome={lastRollResult.outcome} roll={lastRollResult.roll} />
          {(lastRollResult.pacingMove || lastRollResult.failureMove) && (
            <span className="text-dungeon-500 text-xs italic truncate">
              {lastRollResult.pacingMove ?? lastRollResult.failureMove}
            </span>
          )}
        </div>
      )}

      {/* Advance room button */}
      {isRoomCleared && (
        <Button
          id="advance-room-btn"
          variant="gold"
          size="lg"
          className="w-full animate-[fade-up_0.4s_ease-out]"
          onClick={() => void handleAdvanceRoom()}
          loading={isProcessing || isLLMLoading}
          icon={<ChevronRight size={18} />}
        >
          Advance to Next Room
        </Button>
      )}

      {/* Suggested actions */}
      {suggestedActions.length > 0 && !isRoomCleared && (
        <div className="space-y-2">
          <p className="font-display text-[10px] font-semibold text-dungeon-500 uppercase tracking-widest">
            Suggested Tactics
          </p>
          <div className="flex flex-col gap-1.5">
            {suggestedActions.map((action, i) => (
              <button
                key={i}
                id={`suggested-action-${i}`}
                disabled={isDisabled}
                onClick={() => void handleSubmit(action)}
                className={[
                  'text-left px-3.5 py-2.5 rounded-lg border text-sm leading-snug transition-all duration-200',
                  'glass-light border-dungeon-600/40 text-dungeon-300',
                  'hover:border-dungeon-500/60 hover:text-dungeon-100 hover:bg-dungeon-700/30',
                  'active:scale-[0.98] cursor-pointer',
                  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-600',
                  isDisabled ? 'opacity-40 cursor-not-allowed' : '',
                ].join(' ')}
              >
                <span className="text-dungeon-600 text-xs mr-1.5">›</span>
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Custom action input */}
      {!isRoomCleared && (
        <div className="space-y-2">
          <p className="font-display text-[10px] font-semibold text-dungeon-500 uppercase tracking-widest">
            Custom Action
          </p>
          <div className="flex gap-2">
            <textarea
              ref={textareaRef}
              id="custom-action-input"
              value={customAction}
              onChange={(e) => setCustomAction(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isDisabled}
              placeholder="Describe what the party does..."
              rows={2}
              className={[
                'flex-1 resize-none rounded-lg px-3 py-2.5 text-sm leading-relaxed',
                'bg-dungeon-900/80 border border-dungeon-700/60 text-dungeon-200',
                'placeholder:text-dungeon-600 font-body',
                'focus:outline-none focus:border-dungeon-500/80 focus:ring-1 focus:ring-dungeon-600/50',
                'transition-colors',
                isDisabled ? 'opacity-40 cursor-not-allowed' : '',
              ].join(' ')}
            />
            <Button
              id="act-btn"
              variant="roll"
              size="md"
              className="self-end"
              disabled={isDisabled || !customAction.trim()}
              loading={isProcessing || isLLMLoading}
              onClick={() => void handleSubmit(customAction)}
              icon={<Send size={14} />}
            >
              Act
            </Button>
          </div>
          <p className="text-dungeon-600 text-[10px]">
            Press Enter to submit · Shift+Enter for new line
          </p>
        </div>
      )}

      {/* No actions placeholder */}
      {suggestedActions.length === 0 && !isLLMLoading && !isRoomCleared && (
        <div className="flex items-center gap-2 text-dungeon-600 text-xs py-1">
          <Swords size={12} />
          <span>Waiting for the scene to unfold...</span>
        </div>
      )}
    </div>
  );
}
