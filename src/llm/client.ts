/**
 * llm/client.ts – Main LLM dispatch client.
 * Routes requests to the appropriate provider adapter.
 * Handles timeouts, abort signals, and error formatting.
 */

import type { LLMRequestPayload, LLMResponse, LLMClientSettings } from './types';
import { callGemini } from './providers/gemini';
import { callOpenAICompatible } from './providers/openai';
import { callAnthropic } from './providers/anthropic';
import { callWebLLM } from './providers/webllm';

const LLM_TIMEOUT_MS = 30_000;

/**
 * Dispatch an LLM request to the configured provider.
 * Automatically applies a 30-second timeout.
 */
export async function callLLM(
  payload: LLMRequestPayload,
  settings: LLMClientSettings
): Promise<LLMResponse> {
  const { provider, apiKey, model, baseUrl } = settings;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), LLM_TIMEOUT_MS);

  try {
    let response: LLMResponse;

    switch (provider) {
      case 'gemini':
        response = await callGemini(payload, apiKey, model, controller.signal);
        break;

      case 'openai':
        response = await callOpenAICompatible(
          payload, apiKey, model, 'openai', baseUrl, controller.signal
        );
        break;

      case 'openrouter':
        response = await callOpenAICompatible(
          payload, apiKey, model, 'openrouter', baseUrl, controller.signal
        );
        break;

      case 'ollama':
        response = await callOpenAICompatible(
          payload, apiKey, model, 'ollama', baseUrl, controller.signal
        );
        break;

      case 'anthropic':
        response = await callAnthropic(payload, apiKey, model, controller.signal);
        break;

      case 'webllm':
        response = await callWebLLM(payload, model, undefined, controller.signal);
        break;

      default: {
        const _exhaustive: never = provider;
        throw new Error(`Unknown LLM provider: ${String(_exhaustive)}`);
      }
    }

    return response;
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('LLM request timed out after 30 seconds. Please try again.');
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Format an error thrown by callLLM into a user-friendly message.
 */
export function formatLLMError(err: unknown): string {
  if (err instanceof Error) {
    const msg = err.message;
    if (msg.includes('401') || msg.includes('403')) {
      return 'Invalid API key. Please check your settings.';
    }
    if (msg.includes('429')) {
      return 'Rate limit reached. Please wait a moment and try again.';
    }
    if (msg.includes('503') || msg.includes('502')) {
      return 'The AI service is temporarily unavailable. Try again in a few seconds.';
    }
    if (msg.includes('timed out')) {
      return msg;
    }
    return `AI error: ${msg.slice(0, 150)}`;
  }
  return 'An unknown error occurred. Please try again.';
}
