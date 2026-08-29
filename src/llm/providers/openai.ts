/**
 * llm/providers/openai.ts – OpenAI-compatible provider.
 * Used for: OpenAI API, OpenRouter, and Ollama (custom baseUrl).
 */

import { SYSTEM_PROMPT } from '../systemPrompt';
import { parseJsonSafe } from '../sanitizer';
import type { LLMRequestPayload, LLMResponse } from '../types';

const OPENAI_DEFAULT_BASE = 'https://api.openai.com';
const OPENROUTER_BASE = 'https://openrouter.ai/api';
const OLLAMA_DEFAULT_BASE = 'http://localhost:11434';

export type OpenAICompatibleProvider = 'openai' | 'openrouter' | 'ollama';

function getBaseUrl(provider: OpenAICompatibleProvider, customBaseUrl: string): string {
  if (customBaseUrl) return customBaseUrl.replace(/\/$/, '');
  switch (provider) {
    case 'openrouter': return OPENROUTER_BASE;
    case 'ollama':     return OLLAMA_DEFAULT_BASE;
    default:           return OPENAI_DEFAULT_BASE;
  }
}

export async function callOpenAICompatible(
  payload: LLMRequestPayload,
  apiKey: string,
  model: string,
  provider: OpenAICompatibleProvider,
  baseUrl: string,
  signal?: AbortSignal
): Promise<LLMResponse> {
  const base = getBaseUrl(provider, baseUrl);
  const url = `${base}/v1/chat/completions`;

  const modelId = model || (provider === 'openrouter' ? 'mistralai/mistral-7b-instruct:free' : 'gpt-4o-mini');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  // OpenRouter requires site info headers
  if (provider === 'openrouter') {
    headers['HTTP-Referer'] = window.location.origin;
    headers['X-Title'] = 'Dungeon Crawler OPSE';
  }

  const body = {
    model: modelId,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user',   content: JSON.stringify(payload) },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.8,
    max_tokens: 2048,   // 512 was too low for reasoning models (they spend tokens on internal thought)
  };

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    signal,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`${provider} API error ${res.status}: ${errText.slice(0, 300)}`);
  }

  const data = await res.json() as {
    choices?: { message?: { content?: string }; finish_reason?: string }[];
    error?: { message?: string };
  };

  if (data.error) throw new Error(`${provider} error: ${data.error.message}`);

  const choice = data.choices?.[0];
  if (choice?.finish_reason === 'length') {
    console.warn(`[LLM ${provider}] Response truncated (finish_reason=length). The model hit the token limit.`);
  }

  const text = choice?.message?.content ?? '';
  return parseJsonSafe(text);
}
