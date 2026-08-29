/**
 * llm/providers/anthropic.ts – Anthropic Claude API provider.
 * Direct REST fetch to api.anthropic.com/v1/messages
 * Uses prefill technique to force JSON output.
 */

import { SYSTEM_PROMPT } from '../systemPrompt';
import { parseJsonSafe } from '../sanitizer';
import type { LLMRequestPayload, LLMResponse } from '../types';

const ANTHROPIC_BASE_URL = 'https://api.anthropic.com';
const ANTHROPIC_VERSION = '2023-06-01';

export async function callAnthropic(
  payload: LLMRequestPayload,
  apiKey: string,
  model: string,
  signal?: AbortSignal
): Promise<LLMResponse> {
  const modelId = model || 'claude-3-5-haiku-20241022';
  const url = `${ANTHROPIC_BASE_URL}/v1/messages`;

  const body = {
    model: modelId,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: JSON.stringify(payload),
      },
      {
        // JSON prefill: forces Claude to start responding with a JSON object
        role: 'assistant',
        content: '{',
      },
    ],
    max_tokens: 512,
    temperature: 0.8,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': ANTHROPIC_VERSION,
      // Required for direct browser-side calls (bypasses CORS restriction)
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${errText.slice(0, 300)}`);
  }

  const data = await res.json() as {
    content?: { type: string; text?: string }[];
    error?: { message?: string };
  };

  if (data.error) throw new Error(`Anthropic error: ${data.error.message}`);

  const rawText = data.content?.find((c) => c.type === 'text')?.text ?? '';
  // Since we prefilled with '{', Claude's response starts after that prefix
  // We reconstruct the full JSON object
  const fullJson = '{' + rawText;
  return parseJsonSafe(fullJson);
}
