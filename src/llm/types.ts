/**
 * llm/types.ts – Type definitions for the LLM client layer.
 */


// ============================================================
// PROVIDER
// ============================================================

export type LLMProvider =
  | 'gemini'
  | 'openrouter'
  | 'anthropic'
  | 'openai'
  | 'ollama'
  | 'webllm';

// ============================================================
// REQUEST PAYLOADS (Mode A / B / C)
// ============================================================

export interface PartyMemberSummary {
  name: string;
  role: string;
  condition: string;
}

interface BasePayload {
  language: string; // ISO 639-1: 'it' | 'en' | etc.
  dungeonTheme: string;
}

export interface RoomIntroPayload extends BasePayload {
  mode: 'ROOM_INTRO';
  roomNumber: number;
  totalRooms: number;
  opseRoomGeneration: {
    locationType: string;
    encounter: string;
    hazard: string;
    object: string;
  };
  party: PartyMemberSummary[];
}

export interface ActionResolutionPayload extends BasePayload {
  mode: 'ACTION_RESOLUTION';
  roomNumber: number;
  partyAction: string;
  engineResult: {
    outcome: string;
    pacingMove?: string;
    failureMove?: string;
    mechanicalConsequence: string;
  };
  partyStateAfterRoll: PartyMemberSummary[];
}

export interface DungeonEndPayload extends BasePayload {
  mode: 'DUNGEON_END';
  status: 'VICTORY' | 'DEFEAT';
  survivingMembers: string[];
  fallenMembers: string[];
}

export type LLMRequestPayload =
  | RoomIntroPayload
  | ActionResolutionPayload
  | DungeonEndPayload;

// ============================================================
// LLM RESPONSE
// ============================================================

export interface LLMResponse {
  narrative: string;
  roomSummary: string;
  suggestedActions: string[];
}

// ============================================================
// CLIENT SETTINGS
// ============================================================

export interface LLMClientSettings {
  provider: LLMProvider;
  apiKey: string;
  model: string;
  baseUrl: string;
}

// ============================================================
// WEBLLM PROGRESS
// ============================================================

export interface WebLLMProgress {
  progress: number; // 0–1
  text: string;
}
