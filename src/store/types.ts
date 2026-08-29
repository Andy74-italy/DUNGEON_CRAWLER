/**
 * store/types.ts – Central TypeScript types for game state.
 * Sourced from: 02_DATA_MODELS_AND_STATE.md + plan decisions.
 */

// ============================================================
// CHARACTER & PARTY
// ============================================================

export type CharacterRole = 'Warrior' | 'Rogue' | 'Mage' | 'Cleric';

export type CharacterCondition = 'Healthy' | 'Wounded' | 'Exhausted' | 'Disabled';

export interface Character {
  id: string;
  name: string;
  role: CharacterRole;
  description: string;
  /** Condition track: Healthy → Wounded → Exhausted → Disabled */
  condition: CharacterCondition;
  /** 3-4 key personal items */
  inventory: string[];
}

export interface PartyState {
  members: Character[];
  /** Shared loot / keys / potions found during the run */
  inventory: string[];
}

// ============================================================
// DUNGEON & ROOM STATE
// ============================================================

export interface RoomState {
  roomNumber: number;     // 1-based (1 to totalRooms)
  type: string;           // Location type from OPSE Dungeon Crawler table
  encounter: string;      // Encounter type from OPSE
  hazard: string;         // Atmospheric hazard name (e.g. "Ambush", "Poison Darts")
  object: string;         // Object/loot type from OPSE
  exits: string;          // Exit count from OPSE
  cleared: boolean;       // Threat neutralized → room cleared
  historyLog: string[];   // Summary of events in this room
  dungeonTheme: string;   // Inherited dungeon theme for LLM context
}

// ============================================================
// GAME STATE
// ============================================================

export type GameStatus = 'SETUP' | 'EXPLORING' | 'IN_COMBAT' | 'VICTORY' | 'DEFEAT';

export interface GameState {
  dungeonTheme: string;
  currentRoomIndex: number;   // 0-based
  totalRooms: 5 | 6 | 7;
  party: PartyState;
  /** OPSE Chaos Factor – Range 1-9, baseline 5 */
  chaosFactor: number;
  activeRoom: RoomState | null;
  /** Pre-generated rooms for the full dungeon session */
  dungeonRooms: RoomState[];
  gameStatus: GameStatus;
}

// ============================================================
// UI STATE (ephemeral, not persisted to localStorage)
// ============================================================

export type LLMMode = 'ROOM_INTRO' | 'ACTION_RESOLUTION' | 'DUNGEON_END' | null;

export interface UIState {
  /** Is the LLM currently generating a response */
  isLLMLoading: boolean;
  /** Error message from the last LLM call, if any */
  llmError: string | null;
  /** Current narrative prose from the LLM DM */
  currentNarrative: string | null;
  /** Suggested actions provided by the LLM for this turn */
  suggestedActions: string[];
  /** Room summary for display in the log */
  currentRoomSummary: string | null;
  /** Which LLM mode is currently active */
  activeMode: LLMMode;
  /** Whether the dice roll modal is showing */
  showDiceModal: boolean;
  /** Last dice roll result for the modal */
  lastRollResult: import('../engine/opse').ActionResolutionResult | null;
  /** IDs of party members who just got hit (for flash animation) */
  recentlyHitMemberIds: string[];
}

// ============================================================
// SETTINGS STATE (persisted to localStorage)
// ============================================================

export type LLMProvider =
  | 'gemini'
  | 'openrouter'
  | 'anthropic'
  | 'openai'
  | 'ollama'
  | 'webllm';

export interface SettingsState {
  provider: LLMProvider;
  apiKey: string;
  model: string;
  /** Base URL override (for Ollama / custom endpoints) */
  baseUrl: string;
  /** Narrative language code: 'it' | 'en' | other ISO 639-1 */
  language: string;
  /** Whether settings modal is open */
  settingsOpen: boolean;
}

// ============================================================
// COMBINED STORE TYPE
// ============================================================

export interface DungeonStore extends GameState, UIState, SettingsState {
  // Game actions
  startNewGame: (
    theme: string,
    totalRooms: 5 | 6 | 7,
    partyNames: Partial<Record<CharacterRole, string>>
  ) => void;
  enterRoom: (roomIndex: number) => void;
  markRoomCleared: () => void;
  advanceToNextRoom: () => void;
  triggerDefeat: () => void;
  triggerVictory: () => void;
  addToRoomLog: (entry: string) => void;
  updatePartyMember: (id: string, patch: Partial<Character>) => void;
  updatePartyAfterDamage: (updatedMembers: Character[], affectedIds: string[]) => void;
  addSharedLoot: (item: string) => void;
  updateChaosFactor: (delta: number) => void;
  resetGame: () => void;

  // UI actions
  setNarrative: (text: string | null) => void;
  setSuggestedActions: (actions: string[]) => void;
  setRoomSummary: (summary: string | null) => void;
  setLLMLoading: (loading: boolean) => void;
  setLLMError: (error: string | null) => void;
  setActiveMode: (mode: LLMMode) => void;
  showDiceRollModal: (result: import('../engine/opse').ActionResolutionResult) => void;
  hideDiceRollModal: () => void;
  clearLLMState: () => void;

  // Settings actions
  setProvider: (provider: LLMProvider) => void;
  setApiKey: (key: string) => void;
  setModel: (model: string) => void;
  setBaseUrl: (url: string) => void;
  setLanguage: (lang: string) => void;
  setSettingsOpen: (open: boolean) => void;
}
