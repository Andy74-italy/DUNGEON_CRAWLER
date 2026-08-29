/**
 * components/layout/GameScreen.tsx – Main 3-column dungeon gameplay screen.
 *
 * BUG FIXES:
 * 1. useEffect for room intro uses ref + only watches currentRoomIndex (not activeRoom object).
 * 2. Language picker dropdown rendered as FIXED (not absolute inside sticky header) to avoid
 *    CSS stacking context issues. Uses document-level click listener to close.
 * 3. How To Play and Credits modals.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useDungeonStore } from '../../store';
import { PartyHUD } from '../party/PartyHUD';
import { RoomHeader } from '../dungeon/RoomHeader';
import { NarrativePanel } from '../dungeon/NarrativePanel';
import { ActionPanel } from '../dungeon/ActionPanel';
import { DiceRollModal } from '../dungeon/DiceRollModal';
import { SettingsModal } from '../settings/SettingsModal';
import { InfoModal } from '../ui/InfoModal';
import { ChaosBadge } from '../ui/Badge';
import { useLLM } from '../../hooks/useLLM';
import { useTranslations } from '../../i18n/translations';
import { Settings, Skull, Package, BookOpen, Info, Globe } from 'lucide-react';

const LANG_FLAGS: Record<string, string> = {
  en: '🇬🇧', it: '🇮🇹', de: '🇩🇪', fr: '🇫🇷', es: '🇪🇸',
};
const ALL_LANGS = ['en', 'it', 'de', 'fr', 'es'];

export function GameScreen() {
  const store = useDungeonStore();
  // Use a stable selector for setLanguage to avoid stale closures
  const setLanguage = useDungeonStore((s) => s.setLanguage);
  const { callRoomIntro } = useLLM();
  const t = useTranslations(store.language);

  const [infoModal, setInfoModal] = useState<'howToPlay' | 'credits' | null>(null);
  const [showLangPicker, setShowLangPicker] = useState(false);

  // Ref for the lang picker wrapper — used to position the fixed dropdown and detect outside clicks
  const langBtnRef = useRef<HTMLDivElement>(null);

  // FIX: track the room index that has already had its intro called.
  // Using a ref so it persists without causing re-renders.
  const introCalledForRoom = useRef<number | null>(null);

  // Trigger LLM room intro only once per room index.
  // NOTE: We do NOT include store.activeRoom in deps — it's an object whose
  // reference changes on every party update (damage, loot), causing spurious re-runs.
  // currentRoomIndex is the only stable signal for "new room entered".
  useEffect(() => {
    const currentRoom = useDungeonStore.getState().activeRoom;
    if (!currentRoom) return;
    if (introCalledForRoom.current === store.currentRoomIndex) return;
    introCalledForRoom.current = store.currentRoomIndex;
    void callRoomIntro();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.currentRoomIndex]);

  // Close lang picker on click outside
  useEffect(() => {
    if (!showLangPicker) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (langBtnRef.current && !langBtnRef.current.contains(e.target as Node)) {
        setShowLangPicker(false);
      }
    };
    // Small delay so this listener doesn't fire for the same click that opened the picker
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLangPicker]);

  const handleLangChange = useCallback((lang: string) => {
    setLanguage(lang);
    setShowLangPicker(false);
  }, [setLanguage]);

  return (
    <div className="dungeon-bg min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="glass border-b border-dungeon-800/50 px-4 py-2.5 flex items-center justify-between gap-4 sticky top-0" style={{ zIndex: 20 }}>
        <div className="flex items-center gap-3">
          <h1 className="font-decorative text-gold-400 text-sm font-bold tracking-widest animate-[flicker_3s_infinite]">
            {t.topbarTitle}
          </h1>
          <span className="text-dungeon-700">·</span>
          <span className="font-display text-dungeon-500 text-xs truncate max-w-[200px]">
            {store.dungeonTheme}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <ChaosBadge value={store.chaosFactor} />

          {/* Language picker button — dropdown rendered via portal-like fixed div */}
          <div className="relative" ref={langBtnRef}>
            <button
              id="lang-btn"
              onClick={() => setShowLangPicker((v) => !v)}
              className="p-2 rounded-lg text-dungeon-500 hover:text-dungeon-300 hover:bg-dungeon-800/50 transition-colors flex items-center gap-1"
              title={t.narrativeLanguage}
            >
              <Globe size={14} />
              <span className="text-xs font-mono">{LANG_FLAGS[store.language] ?? '🌐'}</span>
            </button>
          </div>

          {/* How To Play */}
          <button
            id="howtoplay-btn"
            onClick={() => setInfoModal('howToPlay')}
            className="p-2 rounded-lg text-dungeon-500 hover:text-dungeon-300 hover:bg-dungeon-800/50 transition-colors"
            title={t.howToPlay}
          >
            <BookOpen size={15} />
          </button>

          {/* Credits */}
          <button
            id="credits-btn"
            onClick={() => setInfoModal('credits')}
            className="p-2 rounded-lg text-dungeon-500 hover:text-dungeon-300 hover:bg-dungeon-800/50 transition-colors"
            title={t.credits}
          >
            <Info size={15} />
          </button>

          {/* Settings */}
          <button
            id="settings-btn"
            onClick={() => store.setSettingsOpen(true)}
            className="p-2 rounded-lg text-dungeon-500 hover:text-dungeon-300 hover:bg-dungeon-800/50 transition-colors"
            title={t.aiSettings}
          >
            <Settings size={15} />
          </button>

          {/* Abandon */}
          <button
            id="reset-btn"
            onClick={() => store.resetGame()}
            className="p-2 rounded-lg text-dungeon-600 hover:text-dungeon-400 hover:bg-dungeon-800/50 transition-colors"
            title={t.abandonDungeon}
          >
            <Skull size={15} />
          </button>
        </div>
      </header>

      {/* Language picker dropdown — rendered OUTSIDE the sticky header to avoid stacking context issues */}
      {showLangPicker && (() => {
        const rect = langBtnRef.current?.getBoundingClientRect();
        return (
          <div
            style={{
              position: 'fixed',
              top: rect ? rect.bottom + 4 : 48,
              right: rect ? window.innerWidth - rect.right : 16,
              zIndex: 9999,
            }}
            className="glass border border-dungeon-600/50 rounded-xl shadow-2xl py-1.5 min-w-[120px]"
          >
            {ALL_LANGS.map((lang) => (
              <button
                key={lang}
                onMouseDown={(e) => {
                  e.preventDefault(); // prevent blur before click
                  handleLangChange(lang);
                }}
                className={[
                  'w-full flex items-center gap-2.5 px-3 py-1.5 text-sm transition-colors',
                  store.language === lang
                    ? 'text-gold-300 bg-dungeon-700/50'
                    : 'text-dungeon-300 hover:text-dungeon-100 hover:bg-dungeon-800/50',
                ].join(' ')}
              >
                <span>{LANG_FLAGS[lang]}</span>
                <span className="uppercase font-mono text-xs">{lang}</span>
              </button>
            ))}
          </div>
        );
      })()}

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
                  {t.partyLootLabel}
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
                {t.roomObjectLabel}
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
      {infoModal && (
        <InfoModal
          isOpen={true}
          onClose={() => setInfoModal(null)}
          mode={infoModal}
        />
      )}
    </div>
  );
}
