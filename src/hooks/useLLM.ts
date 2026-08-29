/**
 * hooks/useLLM.ts – React hook for all LLM call patterns.
 * Wraps the LLM client with store integration and loading/error state.
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
  const store = useDungeonStore();

  const getClientSettings = useCallback(() => ({
    provider: store.provider,
    apiKey: store.apiKey,
    model: store.model,
    baseUrl: store.baseUrl,
  }), [store.provider, store.apiKey, store.model, store.baseUrl]);

  /**
   * Mode A: Call LLM to narrate room entry.
   */
  const callRoomIntro = useCallback(async () => {
    const { activeRoom, party, dungeonTheme, totalRooms, language } = store;
    if (!activeRoom) return;

    store.setLLMLoading(true);
    store.setLLMError(null);
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
      store.setLLMError(formatLLMError(err));
    } finally {
      store.setLLMLoading(false);
    }
  }, [store, getClientSettings]);

  /**
   * Mode B: Call LLM to narrate action resolution.
   */
  const callActionResolution = useCallback(async (
    playerAction: string,
    engineResult: ActionResolutionResult,
    mechanicalConsequence: string
  ) => {
    const { activeRoom, party, dungeonTheme, language } = store;
    if (!activeRoom) return;

    store.setLLMLoading(true);
    store.setLLMError(null);
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
      store.setLLMError(formatLLMError(err));
    } finally {
      store.setLLMLoading(false);
    }
  }, [store, getClientSettings]);

  /**
   * Mode C: Call LLM for dungeon end (Victory or Defeat).
   */
  const callDungeonEnd = useCallback(async (
    status: 'VICTORY' | 'DEFEAT',
    survivingMembers: string[],
    fallenMembers: string[]
  ) => {
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
  }, [store, getClientSettings]);

  return {
    callRoomIntro,
    callActionResolution,
    callDungeonEnd,
    isLoading: store.isLLMLoading,
    error: store.llmError,
  };
}
