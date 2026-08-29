/**
 * components/dungeon/NarrativePanel.tsx – LLM narrative display with log.
 */

import { useState, useRef, useEffect } from 'react';
import { useDungeonStore } from '../../store';
import { NarrativeSkeleton } from '../ui/Spinner';
import { useTranslations } from '../../i18n/translations';
import { ChevronDown, ChevronUp, ScrollText, AlertCircle } from 'lucide-react';

export function NarrativePanel() {
  const store = useDungeonStore();
  const {
    currentNarrative,
    currentRoomSummary,
    isLLMLoading,
    llmError,
    activeRoom,
    activeMode,
    language,
  } = store;
  const t = useTranslations(language);

  const [showLog, setShowLog] = useState(false);
  const narrativeRef = useRef<HTMLDivElement>(null);

  // Scroll to top when new narrative arrives
  useEffect(() => {
    if (currentNarrative && narrativeRef.current) {
      narrativeRef.current.scrollTop = 0;
    }
  }, [currentNarrative]);

  const historyLog = activeRoom?.historyLog ?? [];

  return (
    <div className="glass rounded-xl border border-dungeon-700/40 flex flex-col overflow-hidden min-h-[280px]">
      {/* Main narrative area */}
      <div ref={narrativeRef} className="flex-1 p-5 overflow-y-auto">
        {isLLMLoading ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-arcane-400 text-xs font-display uppercase tracking-widest animate-pulse">
                {activeMode === 'ROOM_INTRO'
                  ? t.settingScene
                  : t.narrating}
              </span>
            </div>
            <NarrativeSkeleton />
          </div>
        ) : llmError ? (
          <div className="flex flex-col items-start gap-3">
            <div className="flex items-center gap-2 text-blood-400">
              <AlertCircle size={16} />
              <span className="text-sm font-medium">{t.aiUnavailable}</span>
            </div>
            <p className="text-dungeon-400 text-sm leading-relaxed">{llmError}</p>
            <p className="text-dungeon-500 text-xs">
              {t.aiUnavailableHint}
            </p>
          </div>
        ) : currentNarrative ? (
          <div className="animate-[fade-up_0.4s_ease-out]">
            {/* Room summary pill */}
            {currentRoomSummary && (
              <p className="text-dungeon-500 text-xs mb-3 italic leading-relaxed border-l-2 border-dungeon-700 pl-3">
                {currentRoomSummary}
              </p>
            )}
            {/* Main narrative prose */}
            <p className="text-dungeon-200 leading-relaxed text-sm font-body">
              {currentNarrative}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <ScrollText size={28} className="text-dungeon-700" />
            <p className="text-dungeon-600 text-sm font-display">
              {t.awaitingDM}
            </p>
            <p className="text-dungeon-700 text-xs">
              {t.awaitingHint}
            </p>
          </div>
        )}
      </div>

      {/* History log (collapsible) */}
      {historyLog.length > 0 && (
        <div className="border-t border-dungeon-700/40">
          <button
            onClick={() => setShowLog((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-2.5 text-dungeon-500 hover:text-dungeon-300 hover:bg-dungeon-800/30 transition-colors text-xs font-display tracking-wide"
          >
            <span className="flex items-center gap-2">
              <ScrollText size={12} />
              {t.roomHistory} ({historyLog.length})
            </span>
            {showLog ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showLog && (
            <div className="px-4 pb-3 max-h-36 overflow-y-auto space-y-1.5">
              {historyLog.map((entry, i) => (
                <p key={i} className="text-dungeon-500 text-xs leading-relaxed border-l border-dungeon-700 pl-2.5">
                  {entry}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
