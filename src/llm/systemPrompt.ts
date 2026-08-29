/**
 * llm/systemPrompt.ts – System prompt and payload builder for all LLM modes.
 * Sources: 04_AI_PROMPTS_AND_ROLES.md
 */

import type {
  RoomIntroPayload,
  ActionResolutionPayload,
  DungeonEndPayload,
  PartyMemberSummary,
} from './types';
import type { RoomState, PartyState } from '../store/types';
import type { ActionResolutionResult } from '../engine/opse';

// ============================================================
// SYSTEM PROMPT
// ============================================================

export const SYSTEM_PROMPT = `You are the AI Game Master for a gritty, fast-paced solo dungeon crawler powered by the One Page Solo Engine (OPSE).
Your role is purely NARRATIVE and ATMOSPHERIC.

Rules:
1. STRICT ADHERENCE: You must faithfully narrate the outcome based on the engine's mechanical result provided in the payload (Strong Hit, Weak Hit, or Miss). Never invert or alter the mechanical outcome.
2. TONE: Dark fantasy, visceral, urgent, and concise. Avoid purple prose, generic fantasy clichés, and long monologues.
3. CONCISENESS: Keep narrative descriptions between 60 and 120 words.
4. SUGGESTIONS: Always provide 3 distinct, practical tactical options for the player's 4-character party, tailored to their remaining alive members.
5. FORMAT: Respond ONLY with a valid JSON object strictly matching this schema:
{
  "narrative": "string (60-120 words of atmospheric prose)",
  "roomSummary": "string (one sentence summary of the current situation)",
  "suggestedActions": ["string", "string", "string"]
}
6. LANGUAGE: Always respond in the language specified by the "language" field in the payload. If language is "it", respond entirely in Italian. If "en", respond in English. Honor any other ISO 639-1 language code provided.
7. NO MARKDOWN: Do not wrap your response in markdown code fences. Output raw JSON only.`;

// ============================================================
// PARTY SUMMARY HELPER
// ============================================================

function partyToSummary(party: PartyState): PartyMemberSummary[] {
  return party.members.map((m) => ({
    name: m.name,
    role: m.role,
    condition: m.condition,
  }));
}

// ============================================================
// OUTCOME LABEL
// ============================================================

function outcomeLabel(result: ActionResolutionResult): string {
  switch (result.outcome) {
    case 'StrongHit': return 'Strong Hit (Yes / Critical Success)';
    case 'WeakHit':   return 'Weak Hit (Yes, but...)';
    case 'Miss':      return 'Miss (No, and...)';
  }
}

// ============================================================
// PAYLOAD BUILDERS
// ============================================================

/**
 * Build a ROOM_INTRO payload.
 */
export function buildRoomIntroPayload(
  room: RoomState,
  party: PartyState,
  dungeonTheme: string,
  totalRooms: number,
  language: string
): RoomIntroPayload {
  return {
    mode: 'ROOM_INTRO',
    language,
    dungeonTheme,
    roomNumber: room.roomNumber,
    totalRooms,
    opseRoomGeneration: {
      locationType: room.type,
      encounter: room.encounter,
      hazard: room.hazard,
      object: room.object,
    },
    party: partyToSummary(party),
  };
}

/**
 * Build an ACTION_RESOLUTION payload.
 */
export function buildActionResolutionPayload(
  playerAction: string,
  engineResult: ActionResolutionResult,
  room: RoomState,
  party: PartyState,
  dungeonTheme: string,
  mechanicalConsequence: string,
  language: string
): ActionResolutionPayload {
  return {
    mode: 'ACTION_RESOLUTION',
    language,
    dungeonTheme,
    roomNumber: room.roomNumber,
    partyAction: playerAction,
    engineResult: {
      outcome: outcomeLabel(engineResult),
      pacingMove: engineResult.pacingMove,
      failureMove: engineResult.failureMove,
      mechanicalConsequence,
    },
    partyStateAfterRoll: partyToSummary(party),
  };
}

/**
 * Build a DUNGEON_END payload.
 */
export function buildDungeonEndPayload(
  status: 'VICTORY' | 'DEFEAT',
  dungeonTheme: string,
  survivingMembers: string[],
  fallenMembers: string[],
  language: string
): DungeonEndPayload {
  return {
    mode: 'DUNGEON_END',
    language,
    status,
    dungeonTheme,
    survivingMembers,
    fallenMembers,
  };
}
