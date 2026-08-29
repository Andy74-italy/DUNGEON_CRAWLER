/**
 * llm/providers/webllm.ts – In-browser WebLLM provider via @mlc-ai/web-llm.
 * Lazy import to avoid loading the heavy SDK when not selected.
 * Uses WebGPU for GPU-accelerated inference.
 */

import { SYSTEM_PROMPT } from '../systemPrompt';
import { parseJsonSafe } from '../sanitizer';
import type { LLMRequestPayload, LLMResponse, WebLLMProgress } from '../types';

// Lazy-loaded engine instance (singleton)
let engineInstance: unknown = null;
let loadedModel: string | null = null;

/** Default lightweight models suitable for WebLLM */
export const WEBLLM_MODELS = [
  { id: 'Qwen2.5-1.5B-Instruct-q4f32_1-MLC', label: 'Qwen2.5 1.5B (Fast, ~1GB)' },
  { id: 'SmolLM2-1.7B-Instruct-q4f16_1-MLC', label: 'SmolLM2 1.7B (Lightweight, ~1GB)' },
  { id: 'Phi-3.5-mini-instruct-q4f16_1-MLC', label: 'Phi-3.5 Mini (Balanced, ~2GB)' },
] as const;

export const DEFAULT_WEBLLM_MODEL = WEBLLM_MODELS[0].id;

/** Check if WebGPU is available in this browser */
export function isWebGPUAvailable(): boolean {
  return typeof navigator !== 'undefined' && 'gpu' in navigator;
}

type ProgressCallback = (progress: WebLLMProgress) => void;

/**
 * Load (or reuse) the WebLLM engine with the specified model.
 * @param modelId – MLC model ID to load
 * @param onProgress – Optional progress callback for download/compilation
 */
export async function loadWebLLMEngine(
  modelId: string,
  onProgress?: ProgressCallback
): Promise<unknown> {
  if (engineInstance && loadedModel === modelId) {
    return engineInstance;
  }

  if (!isWebGPUAvailable()) {
    throw new Error(
      'WebGPU is not available in this browser. Please use Chrome 113+ or Edge 113+ with a compatible GPU.'
    );
  }

  // Lazy import of @mlc-ai/web-llm
  const { CreateMLCEngine } = await import('@mlc-ai/web-llm');

  const engine = await CreateMLCEngine(modelId, {
    initProgressCallback: (report: { progress: number; text: string }) => {
      onProgress?.({
        progress: report.progress,
        text: report.text,
      });
    },
  });

  engineInstance = engine;
  loadedModel = modelId;
  return engine;
}

/**
 * Call the WebLLM engine for inference.
 * Unloads the current model if a different one is requested.
 */
export async function callWebLLM(
  payload: LLMRequestPayload,
  modelId: string,
  onProgress?: ProgressCallback,
  signal?: AbortSignal
): Promise<LLMResponse> {
  const engine = await loadWebLLMEngine(modelId, onProgress) as {
    chat: {
      completions: {
        create: (options: {
          messages: { role: string; content: string }[];
          temperature: number;
          max_tokens: number;
          stream: false;
        }) => Promise<{ choices: { message: { content: string } }[] }>;
      };
    };
  };

  if (signal?.aborted) {
    throw new DOMException('WebLLM call aborted', 'AbortError');
  }

  const response = await engine.chat.completions.create({
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user',   content: JSON.stringify(payload) },
    ],
    temperature: 0.8,
    max_tokens: 512,
    stream: false,
  });

  const text = response.choices[0]?.message?.content ?? '';
  return parseJsonSafe(text);
}

/** Reset the WebLLM engine (force model reload on next call) */
export function resetWebLLMEngine(): void {
  engineInstance = null;
  loadedModel = null;
}
