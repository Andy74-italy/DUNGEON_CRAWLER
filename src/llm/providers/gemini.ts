/**
 * llm/providers/gemini.ts – Google Gemini API provider.
 * Direct REST fetch to generativelanguage.googleapis.com
 */

import { SYSTEM_PROMPT } from '../systemPrompt';
import { parseJsonSafe } from '../sanitizer';
import type { LLMRequestPayload, LLMResponse } from '../types';

const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

export async function callGemini(
  payload: LLMRequestPayload,
  apiKey: string,
  model: string,
  signal?: AbortSignal
): Promise<LLMResponse> {
  const modelId = model || 'gemini-2.0-flash';
  const url = `${GEMINI_BASE_URL}/models/${modelId}:generateContent?key=${apiKey}`;

  const body = {
    system_instruction: {
      parts: [{ text: SYSTEM_PROMPT }],
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: JSON.stringify(payload) }],
      },
    ],
    generationConfig: {
      response_mime_type: 'application/json',
      temperature: 0.8,
      maxOutputTokens: 2048,  // increased from 512 — reasoning models need more budget
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${errText.slice(0, 300)}`);
  }

  const data = await res.json() as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
    error?: { message?: string };
  };

  if (data.error) {
    throw new Error(`Gemini error: ${data.error.message}`);
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  return parseJsonSafe(text);
}
