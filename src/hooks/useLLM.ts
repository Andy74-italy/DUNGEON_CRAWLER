/**
 * hooks/useLLM.ts – React hook for all LLM call patterns.
 * Wraps the LLM client with store integration and loading/error state.
 *
 * FIX: Read all store values via getState() at call-time rather than capturing
 * them in useCallback closures, to avoid stale language/settings values.
 */

import { useCallback } from 'react';
import { useDungeonStore } from '../store';
import { callLLM, formatLLMError } from '../llm/client';
import {
  buildRoomIntroPayload,
  buildActionResolutionPayload,
  buildDungeonEndPayload,
} from '../llm/systemPrompt';
import type { ActionResolutionResult } from '../engine/opse';

export function useLLM() {
  // We subscribe only to the loading/error flags for component re-renders.
  const isLLMLoading = useDungeonStore((s) => s.isLLMLoading);
  const llmError = useDungeonStore((s) => s.llmError);

  /**
   * Read fresh state at call-time. This avoids stale closures for
   * language, apiKey, provider, model, activeRoom, party, etc.
   */
  const getFreshState = useCallback(() => {
    return useDungeonStore.getState();
  }, []);

  const getClientSettings = useCallback(() => {
    const s = useDungeonStore.getState();
    return {
      provider: s.provider,
      apiKey: s.apiKey,
      model: s.model,
      baseUrl: s.baseUrl,
    };
  }, []);

  /**
   * Mode A: Call LLM to narrate room entry.
   */
  const callRoomIntro = useCallback(async () => {
    const store = getFreshState();
    const { activeRoom, party, dungeonTheme, totalRooms, language } = store;
    if (!activeRoom) return;

    store.setLLMLoading(true);
    store.setLLMError(null);
    store.setNarrative(null);           // Clear stale narrative
    store.setSuggestedActions([]);      // Clear stale suggestions
    store.setActiveMode('ROOM_INTRO');

    try {
      const payload = buildRoomIntroPayload(
        activeRoom, party, dungeonTheme, totalRooms, language
      );
      const response = await callLLM(payload, getClientSettings());
      store.setNarrative(response.narrative);
      store.setSuggestedActions(response.suggestedActions);
      store.setRoomSummary(response.roomSummary);
    } catch (err) {
      console.error('[useLLM] callRoomIntro failed:', err);
      store.setLLMError(formatLLMError(err));
    } finally {
      store.setLLMLoading(false);
    }
  }, [getFreshState, getClientSettings]);

  /**
   * Mode B: Call LLM to narrate action resolution.
   */
  const callActionResolution = useCallback(async (
    playerAction: string,
    engineResult: ActionResolutionResult,
    mechanicalConsequence: string
  ) => {
    const store = getFreshState();
    const { activeRoom, party, dungeonTheme, language } = store;
    if (!activeRoom) return;

    store.setLLMLoading(true);
    store.setLLMError(null);
    store.setNarrative(null);           // Clear stale narrative
    store.setSuggestedActions([]);      // Clear stale suggestions
    store.setActiveMode('ACTION_RESOLUTION');

    try {
      const payload = buildActionResolutionPayload(
        playerAction,
        engineResult,
        activeRoom,
        party,
        dungeonTheme,
        mechanicalConsequence,
        language
      );
      const response = await callLLM(payload, getClientSettings());
      store.setNarrative(response.narrative);
      store.setSuggestedActions(response.suggestedActions);
      store.setRoomSummary(response.roomSummary);

      // Log the summary to room history
      if (response.roomSummary) {
        store.addToRoomLog(response.roomSummary);
      }
    } catch (err) {
      console.error('[useLLM] callActionResolution failed:', err);
      store.setLLMError(formatLLMError(err));
    } finally {
      store.setLLMLoading(false);
    }
  }, [getFreshState, getClientSettings]);

  /**
   * Mode C: Call LLM for dungeon end (Victory or Defeat).
   */
  const callDungeonEnd = useCallback(async (
    status: 'VICTORY' | 'DEFEAT',
    survivingMembers: string[],
    fallenMembers: string[]
  ) => {
    const store = getFreshState();
    const { dungeonTheme, language } = store;

    store.setLLMLoading(true);
    store.setLLMError(null);
    store.setActiveMode('DUNGEON_END');

    try {
      const payload = buildDungeonEndPayload(
        status, dungeonTheme, survivingMembers, fallenMembers, language
      );
      const response = await callLLM(payload, getClientSettings());
      store.setNarrative(response.narrative);
      store.setSuggestedActions(response.suggestedActions);
    } catch (err) {
      store.setLLMError(formatLLMError(err));
    } finally {
      store.setLLMLoading(false);
    }
  }, [getFreshState, getClientSettings]);

  return {
    callRoomIntro,
    callActionResolution,
    callDungeonEnd,
    isLoading: isLLMLoading,
    error: llmError,
  };
}
