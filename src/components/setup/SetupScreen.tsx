/**
 * components/setup/SetupScreen.tsx – Game setup screen with party configuration.
 */

import { useState } from 'react';
import { useDungeonStore } from '../../store';
import { SettingsModal } from '../settings/SettingsModal';
import { Button } from '../ui/Button';
import { RoleBadge } from '../ui/Badge';
import {
  generateDungeonNameSuggestion,
  generatePlotHook,
} from '../../engine';
import { Settings, Dices, Swords } from 'lucide-react';
import type { CharacterRole } from '../../store/types';

const DEFAULT_NAMES: Record<CharacterRole, string> = {
  Warrior: 'Valen',
  Rogue:   'Lyra',
  Mage:    'Thorne',
  Cleric:  'Kael',
};

const ROLES: CharacterRole[] = ['Warrior', 'Rogue', 'Mage', 'Cleric'];

const ROLE_DESCRIPTIONS: Record<CharacterRole, string> = {
  Warrior: 'Stalwart frontliner, shield and blade.',
  Rogue:   'Shadow-walker, blades and cunning.',
  Mage:    'Arcane scholar, power at a price.',
  Cleric:  'Divine conduit, healer and smiter.',
};

const ROLE_INVENTORIES: Record<CharacterRole, string[]> = {
  Warrior: ['Longsword', 'Tower Shield', 'Chainmail'],
  Rogue:   ['Twin Daggers', 'Lockpick Set', 'Smoke Bomb'],
  Mage:    ['Spellbook', 'Arcane Focus', 'Scroll of Fireball'],
  Cleric:  ['Holy Mace', 'Sacred Shield', 'Divine Lantern'],
};

export function SetupScreen() {
  const store = useDungeonStore();

  const [dungeonName, setDungeonName] = useState('');
  const [totalRooms, setTotalRooms] = useState<5 | 6 | 7>(6);
  const [partyNames, setPartyNames] = useState<Record<CharacterRole, string>>({ ...DEFAULT_NAMES });
  const [plotHint, setPlotHint] = useState<string>('');

  const handleGenerateTheme = () => {
    const name = generateDungeonNameSuggestion();
    const hook = generatePlotHook();
    setDungeonName(name);
    setPlotHint(`Objective: ${hook.objective} · Adversary: ${hook.adversary} · Reward: ${hook.reward}`);
  };

  const handleStart = () => {
    const theme = dungeonName.trim() || generateDungeonNameSuggestion();
    store.startNewGame(theme, totalRooms, partyNames);
  };


  return (
    <div className="dungeon-bg min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Settings button */}
      <button
        id="setup-settings-btn"
        onClick={() => store.setSettingsOpen(true)}
        className="fixed top-4 right-4 p-2.5 rounded-lg glass border border-dungeon-700/40 text-dungeon-400 hover:text-dungeon-200 hover:border-dungeon-600 transition-all"
        title="AI Settings"
      >
        <Settings size={16} />
      </button>

      <div className="w-full max-w-2xl space-y-8 animate-[fade-up_0.5s_ease-out]">
        {/* Title */}
        <div className="text-center space-y-3">
          <h1 className="font-decorative text-5xl font-bold text-gradient-gold animate-[flicker_3s_infinite] leading-tight">
            Dungeon Crawler
          </h1>
          <p className="font-display text-dungeon-400 text-sm tracking-widest uppercase">
            Powered by One Page Solo Engine
          </p>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold-700 to-transparent mx-auto" />
        </div>

        {/* Dungeon Name */}
        <div className="glass rounded-xl border border-dungeon-700/40 p-6 space-y-4">
          <h2 className="font-display text-dungeon-300 text-sm font-semibold uppercase tracking-widest">
            ⚔ Dungeon Configuration
          </h2>

          {/* Theme input */}
          <div>
            <label htmlFor="dungeon-name" className="block text-xs font-display text-dungeon-500 uppercase tracking-wider mb-2">
              Dungeon Name / Theme
            </label>
            <div className="flex gap-2">
              <input
                id="dungeon-name"
                type="text"
                value={dungeonName}
                onChange={(e) => setDungeonName(e.target.value)}
                placeholder="e.g. Sunken Monastery of the Red Abbot"
                className="flex-1 bg-dungeon-900/80 border border-dungeon-700/60 rounded-lg px-3 py-2.5 text-sm text-dungeon-200 placeholder:text-dungeon-600 focus:outline-none focus:border-dungeon-500/80 font-body"
              />
              <Button
                id="generate-theme-btn"
                variant="ghost"
                size="md"
                onClick={handleGenerateTheme}
                icon={<Dices size={14} />}
                title="Generate random theme"
              >
                Roll
              </Button>
            </div>
            {plotHint && (
              <p className="text-dungeon-600 text-xs mt-2 italic leading-relaxed animate-[fade-up_0.3s_ease-out]">
                {plotHint}
              </p>
            )}
          </div>

          {/* Room count selector */}
          <div>
            <label className="block text-xs font-display text-dungeon-500 uppercase tracking-wider mb-2">
              Dungeon Length
            </label>
            <div className="flex gap-2">
              {([5, 6, 7] as const).map((n) => (
                <button
                  key={n}
                  onClick={() => setTotalRooms(n)}
                  className={[
                    'flex-1 py-2.5 rounded-lg border font-display text-sm font-semibold transition-all duration-200',
                    totalRooms === n
                      ? 'bg-dungeon-700 border-dungeon-500 text-dungeon-100 shadow-[0_0_8px_1px_hsl(228_20%_24%_/_0.4)]'
                      : 'bg-dungeon-900/60 border-dungeon-700/40 text-dungeon-500 hover:border-dungeon-600 hover:text-dungeon-300',
                  ].join(' ')}
                >
                  {n} Rooms
                  <span className="block text-[9px] font-body font-normal mt-0.5 opacity-70">
                    {n === 5 ? '~15 min' : n === 6 ? '~20 min' : '~30 min'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Party names */}
        <div className="glass rounded-xl border border-dungeon-700/40 p-6 space-y-4">
          <h2 className="font-display text-dungeon-300 text-sm font-semibold uppercase tracking-widest">
            🗡 Your Party
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {ROLES.map((role) => (
              <div key={role} className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <RoleBadge role={role} />
                  <span className="text-dungeon-600 text-[10px] truncate">{ROLE_DESCRIPTIONS[role]}</span>
                </div>
                <input
                  id={`party-name-${role.toLowerCase()}`}
                  type="text"
                  value={partyNames[role]}
                  onChange={(e) =>
                    setPartyNames((prev) => ({ ...prev, [role]: e.target.value }))
                  }
                  placeholder={DEFAULT_NAMES[role]}
                  maxLength={20}
                  className="w-full bg-dungeon-900/80 border border-dungeon-700/60 rounded-lg px-3 py-2 text-sm text-dungeon-200 placeholder:text-dungeon-600 focus:outline-none focus:border-dungeon-500/80 font-body"
                />
                <div className="flex flex-wrap gap-1">
                  {ROLE_INVENTORIES[role].map((item, i) => (
                    <span key={i} className="text-[9px] text-dungeon-600 px-1.5 py-0.5 bg-dungeon-800/40 border border-dungeon-700/30 rounded">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Start button */}
        <Button
          id="start-game-btn"
          variant="roll"
          size="lg"
          className="w-full text-base"
          onClick={handleStart}
          icon={<Swords size={18} />}
        >
          Enter the Dungeon
        </Button>

        <p className="text-dungeon-700 text-xs text-center">
          Configure your AI Dungeon Master via ⚙ Settings before starting.
        </p>
      </div>

      <SettingsModal />
    </div>
  );
}
