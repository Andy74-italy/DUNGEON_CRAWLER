/**
 * llm/sanitizer.ts – Robust JSON parser/sanitizer for LLM responses.
 * Handles markdown fences, partial JSON, and missing fields gracefully.
 */

import type { LLMResponse } from './types';

const FALLBACK_RESPONSE: LLMResponse = {
  narrative:
    'The shadows press close. Something stirs in the darkness ahead, but the details remain unclear. The party waits, weapons ready.',
  roomSummary: 'The situation is unclear. Proceed with caution.',
  suggestedActions: [
    'Advance carefully, weapons drawn.',
    'Scout the perimeter before engaging.',
    'Hold position and listen for movement.',
  ],
};

/**
 * Attempt to parse a raw LLM string into a valid LLMResponse.
 *
 * Strategy (4 levels of fallback):
 * 1. Direct JSON.parse()
 * 2. Strip markdown code fences (```json ... ```)
 * 3. Extract first {...} block via regex
 * 4. Return hardcoded fallback response
 */
export function parseJsonSafe(raw: string): LLMResponse {
  // Diagnostic log — visible in browser DevTools console
  console.log('[LLM Sanitizer] Raw response received:', raw.slice(0, 500));

  // Level 1: Direct parse
  try {
    const parsed = JSON.parse(raw);
    console.log('[LLM Sanitizer] ✓ Parsed at Level 1 (direct)');
    return validateAndNormalize(parsed);
  } catch {
    // continue
  }

  // Level 2: Strip markdown fences
  const stripped = raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/i, '')
    .trim();

  try {
    const parsed = JSON.parse(stripped);
    console.log('[LLM Sanitizer] ✓ Parsed at Level 2 (stripped fences)');
    return validateAndNormalize(parsed);
  } catch {
    // continue
  }

  // Level 3: Extract first JSON object via regex
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      console.log('[LLM Sanitizer] ✓ Parsed at Level 3 (regex extract)');
      return validateAndNormalize(parsed);
    } catch {
      // continue
    }
  }

  // Level 3b: Try to extract and fix truncated JSON
  const partialMatch = raw.match(/\{[\s\S]*/);
  if (partialMatch) {
    try {
      // Attempt to close truncated JSON by appending }
      const fixed = partialMatch[0].replace(/,?\s*$/, '') + '}';
      const parsed = JSON.parse(fixed);
      console.log('[LLM Sanitizer] ✓ Parsed at Level 3b (partial fix)');
      return validateAndNormalize(parsed);
    } catch {
      // continue
    }
  }

  // Level 4: Fallback
  console.warn('[LLM Sanitizer] ✗ FALLBACK used. Full raw response:', raw);
  return { ...FALLBACK_RESPONSE };
}

/**
 * Validate parsed object has the required LLMResponse shape.
 * Fills in missing fields with fallback values.
 */
function validateAndNormalize(obj: unknown): LLMResponse {
  if (typeof obj !== 'object' || obj === null) {
    return { ...FALLBACK_RESPONSE };
  }

  const record = obj as Record<string, unknown>;

  const narrative =
    typeof record['narrative'] === 'string' && record['narrative'].length > 0
      ? record['narrative']
      : FALLBACK_RESPONSE.narrative;

  const roomSummary =
    typeof record['roomSummary'] === 'string' && record['roomSummary'].length > 0
      ? record['roomSummary']
      : FALLBACK_RESPONSE.roomSummary;

  const suggestedActions = Array.isArray(record['suggestedActions'])
    ? (record['suggestedActions'] as unknown[])
        .filter((a): a is string => typeof a === 'string')
        .slice(0, 4)
    : FALLBACK_RESPONSE.suggestedActions;

  return { narrative, roomSummary, suggestedActions };
}
