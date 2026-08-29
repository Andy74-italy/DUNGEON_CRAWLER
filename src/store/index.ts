/**
 * store/index.ts – Zustand store with persist middleware.
 * Single source of truth for all app state.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  DungeonStore,
  GameState,
  UIState,
  SettingsState,
  Character,
  CharacterRole,
  LLMMode,
  LLMProvider,
} from './types';
import type { ActionResolutionResult } from '../engine/opse';
import { initParty, generateDungeonSession } from '../engine/dungeon';

// ============================================================
// INITIAL STATES
// ============================================================

const initialGameState: GameState = {
  dungeonTheme: '',
  currentRoomIndex: 0,
  totalRooms: 6,
  party: initParty(),
  chaosFactor: 5,
  activeRoom: null,
  dungeonRooms: [],
  gameStatus: 'SETUP',
};

const initialUIState: UIState = {
  isLLMLoading: false,
  llmError: null,
  currentNarrative: null,
  suggestedActions: [],
  currentRoomSummary: null,
  activeMode: null,
  showDiceModal: false,
  lastRollResult: null,
  recentlyHitMemberIds: [],
};

const initialSettingsState: SettingsState = {
  provider: 'gemini',
  apiKey: '',
  model: 'gemini-2.0-flash',
  baseUrl: '',
  language: 'en',
  settingsOpen: false,
};

// ============================================================
// STORE
// ============================================================

export const useDungeonStore = create<DungeonStore>()(
  persist(
    (set, get) => ({
      // ── Initial state ──────────────────────────────────────
      ...initialGameState,
      ...initialUIState,
      ...initialSettingsState,

      // ════════════════════════════════════════════════════════
      // GAME ACTIONS
      // ════════════════════════════════════════════════════════

      startNewGame: (
        theme: string,
        totalRooms: 5 | 6 | 7,
        partyNames: Partial<Record<CharacterRole, string>>
      ) => {
        const dungeonRooms = generateDungeonSession(theme, totalRooms);
        const party = initParty(partyNames);
        set({
          dungeonTheme: theme,
          totalRooms,
          party,
          chaosFactor: 5,
          currentRoomIndex: 0,
          dungeonRooms,
          activeRoom: dungeonRooms[0] ?? null,
          gameStatus: 'EXPLORING',
          // Reset UI
          ...initialUIState,
        });
      },

      enterRoom: (roomIndex: number) => {
        const { dungeonRooms } = get();
        const room = dungeonRooms[roomIndex] ?? null;
        set({
          currentRoomIndex: roomIndex,
          activeRoom: room,
          gameStatus: 'EXPLORING',
          // Clear narrative for new room
          currentNarrative: null,
          suggestedActions: [],
          currentRoomSummary: null,
          llmError: null,
          activeMode: 'ROOM_INTRO',
        });
      },

      markRoomCleared: () => {
        const { currentRoomIndex, dungeonRooms, activeRoom } = get();
        if (!activeRoom) return;
        const updatedRoom = { ...activeRoom, cleared: true };
        const updatedRooms = dungeonRooms.map((r, i) =>
          i === currentRoomIndex ? updatedRoom : r
        );
        set({ activeRoom: updatedRoom, dungeonRooms: updatedRooms });
      },

      advanceToNextRoom: () => {
        const { currentRoomIndex, totalRooms } = get();
        const nextIndex = currentRoomIndex + 1;
        if (nextIndex >= totalRooms) {
          get().triggerVictory();
        } else {
          get().enterRoom(nextIndex);
        }
      },

      triggerDefeat: () => {
        set({ gameStatus: 'DEFEAT', activeMode: 'DUNGEON_END' });
      },

      triggerVictory: () => {
        set({ gameStatus: 'VICTORY', activeMode: 'DUNGEON_END' });
      },

      addToRoomLog: (entry: string) => {
        const { activeRoom, currentRoomIndex, dungeonRooms } = get();
        if (!activeRoom) return;
        const updatedRoom = {
          ...activeRoom,
          historyLog: [...activeRoom.historyLog, entry],
        };
        const updatedRooms = dungeonRooms.map((r, i) =>
          i === currentRoomIndex ? updatedRoom : r
        );
        set({ activeRoom: updatedRoom, dungeonRooms: updatedRooms });
      },

      updatePartyMember: (id: string, patch: Partial<Character>) => {
        const { party } = get();
        const updatedMembers = party.members.map((m) =>
          m.id === id ? { ...m, ...patch } : m
        );
        set({ party: { ...party, members: updatedMembers } });
      },

      updatePartyAfterDamage: (updatedMembers: Character[], affectedIds: string[]) => {
        const { party } = get();
        set({
          party: { ...party, members: updatedMembers },
          recentlyHitMemberIds: affectedIds,
        });
        // Clear flash animation after 1s
        setTimeout(() => {
          set({ recentlyHitMemberIds: [] });
        }, 1000);
      },

      addSharedLoot: (item: string) => {
        const { party } = get();
        set({ party: { ...party, inventory: [...party.inventory, item] } });
      },

      updateChaosFactor: (delta: number) => {
        const { chaosFactor } = get();
        const newCF = Math.max(1, Math.min(9, chaosFactor + delta));
        set({ chaosFactor: newCF });
      },

      resetGame: () => {
        set({
          ...initialGameState,
          ...initialUIState,
          party: initParty(),
        });
      },

      // ════════════════════════════════════════════════════════
      // UI ACTIONS
      // ════════════════════════════════════════════════════════

      setNarrative: (text: string | null) => set({ currentNarrative: text }),

      setSuggestedActions: (actions: string[]) => set({ suggestedActions: actions }),

      setRoomSummary: (summary: string | null) => set({ currentRoomSummary: summary }),

      setLLMLoading: (loading: boolean) => set({ isLLMLoading: loading }),

      setLLMError: (error: string | null) => set({ llmError: error }),

      setActiveMode: (mode: LLMMode) => set({ activeMode: mode }),

      showDiceRollModal: (result: ActionResolutionResult) =>
        set({ showDiceModal: true, lastRollResult: result }),

      hideDiceRollModal: () => set({ showDiceModal: false }),

      clearLLMState: () =>
        set({
          currentNarrative: null,
          suggestedActions: [],
          currentRoomSummary: null,
          llmError: null,
          isLLMLoading: false,
          activeMode: null,
        }),

      // ════════════════════════════════════════════════════════
      // SETTINGS ACTIONS
      // ════════════════════════════════════════════════════════

      setProvider: (provider: LLMProvider) => set({ provider }),
      setApiKey: (key: string) => set({ apiKey: key }),
      setModel: (model: string) => set({ model }),
      setBaseUrl: (url: string) => set({ baseUrl: url }),
      setLanguage: (lang: string) => set({ language: lang }),
      setSettingsOpen: (open: boolean) => set({ settingsOpen: open }),
    }),
    {
      name: 'dungeon-prj-v1',
      storage: createJSONStorage(() => localStorage),
      // Exclude ephemeral UI state from persistence
      partialize: (state) => ({
        // Game state
        dungeonTheme: state.dungeonTheme,
        currentRoomIndex: state.currentRoomIndex,
        totalRooms: state.totalRooms,
        party: state.party,
        chaosFactor: state.chaosFactor,
        activeRoom: state.activeRoom,
        dungeonRooms: state.dungeonRooms,
        gameStatus: state.gameStatus,
        // Settings (persisted)
        provider: state.provider,
        apiKey: state.apiKey,
        model: state.model,
        baseUrl: state.baseUrl,
        language: state.language,
        // NOT persisted: isLLMLoading, llmError, showDiceModal, recentlyHitMemberIds,
        //               currentNarrative, suggestedActions, activeMode, settingsOpen
      }),
    }
  )
);
