# 05 - LLM CLIENT-SIDE INTEGRATION & BYOK SPECIFICATION

## 1. Architectural Strategy: Client-Side Bring-Your-Own-Key (BYOK)
- Zero centralized backend cost. All AI inference requests are performed client-side from the user's browser.
- The user provides their own API Key via a Settings Modal, stored locally in `localStorage`.
- No user API keys are ever stored on or transmitted to an external server other than the target LLM provider.

## 2. Supported Provider Adapters
The application must provide a modular provider interface (`LLMProvider`) supporting:
1. **Google Gemini API** (Direct REST fetch) -> Recommended for high-speed free tier.
2. **OpenRouter API** (OpenAI-compatible) -> Access to hundreds of models, including free community models.
3. **Anthropic Claude API** (Direct REST fetch to `/v1/messages`).
4. **OpenAI API** (Direct REST fetch to `/v1/chat/completions`).
5. **Localhost / Ollama** (Custom base URL, e.g. `http://localhost:11434/v1`).
6. **In-Browser WebGPU (WebLLM / @mlc-ai/web-llm)** *(Optional/Zero-Config)* -> Runs lightweight open-source models (e.g., SmolLM, Qwen, Phi-3) directly inside the browser using client GPU with zero API keys required.

## 3. Strict JSON Enforcement Strategy
- Providers supporting `response_format: { type: "json_object" }` or structured schema must have it enabled.
- Include a client-side JSON sanitizer/fallback parser to handle potential markdown fence wrapping (e.g., stripping ````json ... ````).