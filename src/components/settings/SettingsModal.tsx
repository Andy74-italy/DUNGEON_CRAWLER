/**
 * components/settings/SettingsModal.tsx – BYOK provider settings.
 */

import { useState } from 'react';
import { useDungeonStore } from '../../store';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Eye, EyeOff, Globe, Cpu, Zap } from 'lucide-react';
import type { LLMProvider } from '../../store/types';
import { WEBLLM_MODELS, isWebGPUAvailable } from '../../llm/providers/webllm';

const PROVIDERS: { id: LLMProvider; label: string; icon: string; defaultModel: string; needsKey: boolean; needsUrl: boolean }[] = [
  { id: 'gemini',      label: 'Google Gemini',    icon: '✦', defaultModel: 'gemini-2.0-flash',               needsKey: true,  needsUrl: false },
  { id: 'openrouter',  label: 'OpenRouter',       icon: '⊕', defaultModel: 'google/gemma-3-27b-it:free',     needsKey: true,  needsUrl: false },
  { id: 'openai',      label: 'OpenAI',           icon: '◎', defaultModel: 'gpt-4o-mini',                    needsKey: true,  needsUrl: false },
  { id: 'anthropic',   label: 'Anthropic Claude', icon: '◇', defaultModel: 'claude-3-5-haiku-20241022',      needsKey: true,  needsUrl: false },
  { id: 'ollama',      label: 'Ollama (Local)',   icon: '⬡', defaultModel: 'llama3.2',                       needsKey: false, needsUrl: true  },
  { id: 'webllm',      label: 'WebLLM (No Key)',  icon: '⚡', defaultModel: WEBLLM_MODELS[0].id,             needsKey: false, needsUrl: false },
];

const LANGUAGES = [
  { code: 'en', label: '🇬🇧 English' },
  { code: 'it', label: '🇮🇹 Italiano' },
  { code: 'de', label: '🇩🇪 Deutsch' },
  { code: 'fr', label: '🇫🇷 Français' },
  { code: 'es', label: '🇪🇸 Español' },
];

export function SettingsModal() {
  const store = useDungeonStore();
  const [showKey, setShowKey] = useState(false);
  const webGPUAvailable = isWebGPUAvailable();

  const currentProvider = PROVIDERS.find((p) => p.id === store.provider);

  const handleProviderChange = (id: LLMProvider) => {
    store.setProvider(id);
    const prov = PROVIDERS.find((p) => p.id === id);
    if (prov) store.setModel(prov.defaultModel);
    // Reset URL if not ollama
    if (id !== 'ollama') store.setBaseUrl('');
  };

  return (
    <Modal
      isOpen={store.settingsOpen}
      onClose={() => store.setSettingsOpen(false)}
      title="⚙ AI Dungeon Master Settings"
      size="lg"
    >
      <div className="space-y-5">
        {/* Language selector */}
        <div>
          <label className="block text-xs font-display font-semibold text-dungeon-400 uppercase tracking-widest mb-2">
            <Globe size={10} className="inline mr-1.5" />
            Narrative Language
          </label>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => store.setLanguage(lang.code)}
                className={[
                  'px-3 py-1.5 rounded-lg text-sm border transition-all duration-200',
                  store.language === lang.code
                    ? 'bg-dungeon-700 border-dungeon-500 text-dungeon-100'
                    : 'bg-dungeon-900/60 border-dungeon-700/40 text-dungeon-400 hover:border-dungeon-600 hover:text-dungeon-300',
                ].join(' ')}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Provider selector */}
        <div>
          <label className="block text-xs font-display font-semibold text-dungeon-400 uppercase tracking-widest mb-2">
            <Cpu size={10} className="inline mr-1.5" />
            AI Provider
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PROVIDERS.map((prov) => {
              const isWebLLM = prov.id === 'webllm';
              const disabled = isWebLLM && !webGPUAvailable;
              return (
                <button
                  key={prov.id}
                  onClick={() => !disabled && handleProviderChange(prov.id)}
                  disabled={disabled}
                  title={disabled ? 'WebGPU not available in this browser' : prov.label}
                  className={[
                    'flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-all duration-200 text-left',
                    store.provider === prov.id
                      ? 'bg-dungeon-700/80 border-dungeon-500 text-dungeon-100 shadow-[0_0_8px_1px_hsl(228_20%_24%_/_0.5)]'
                      : 'bg-dungeon-900/60 border-dungeon-700/40 text-dungeon-400 hover:border-dungeon-600 hover:text-dungeon-300',
                    disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
                  ].join(' ')}
                >
                  <span className="text-base leading-none">{prov.icon}</span>
                  <span className="truncate">{prov.label}</span>
                  {prov.id === 'openrouter' && (
                    <span className="ml-auto text-[9px] bg-poison-700/40 text-poison-400 px-1 rounded">FREE</span>
                  )}
                  {isWebLLM && !webGPUAvailable && (
                    <span className="ml-auto text-[9px] text-dungeon-600">No WebGPU</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* API Key */}
        {currentProvider?.needsKey && (
          <div>
            <label htmlFor="api-key-input" className="block text-xs font-display font-semibold text-dungeon-400 uppercase tracking-widest mb-2">
              API Key
            </label>
            <div className="relative">
              <input
                id="api-key-input"
                type={showKey ? 'text' : 'password'}
                value={store.apiKey}
                onChange={(e) => store.setApiKey(e.target.value)}
                placeholder={`${currentProvider.label} API Key`}
                className="w-full bg-dungeon-900/80 border border-dungeon-700/60 rounded-lg px-3 py-2.5 pr-10 text-sm text-dungeon-200 placeholder:text-dungeon-600 focus:outline-none focus:border-dungeon-500/80 font-mono"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dungeon-500 hover:text-dungeon-300 transition-colors"
              >
                {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <p className="text-dungeon-600 text-[10px] mt-1">
              Stored locally in your browser. Never transmitted to any server other than the selected provider.
            </p>
          </div>
        )}

        {/* Model selection */}
        <div>
          <label htmlFor="model-input" className="block text-xs font-display font-semibold text-dungeon-400 uppercase tracking-widest mb-2">
            Model
          </label>
          {store.provider === 'webllm' ? (
            <select
              id="model-input"
              value={store.model}
              onChange={(e) => store.setModel(e.target.value)}
              className="w-full bg-dungeon-900/80 border border-dungeon-700/60 rounded-lg px-3 py-2.5 text-sm text-dungeon-200 focus:outline-none focus:border-dungeon-500/80"
            >
              {WEBLLM_MODELS.map((m) => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          ) : (
            <input
              id="model-input"
              type="text"
              value={store.model}
              onChange={(e) => store.setModel(e.target.value)}
              placeholder={currentProvider?.defaultModel ?? 'model-name'}
              className="w-full bg-dungeon-900/80 border border-dungeon-700/60 rounded-lg px-3 py-2.5 text-sm text-dungeon-200 placeholder:text-dungeon-600 focus:outline-none focus:border-dungeon-500/80 font-mono"
            />
          )}
        </div>

        {/* Base URL (Ollama / custom) */}
        {currentProvider?.needsUrl && (
          <div>
            <label htmlFor="base-url-input" className="block text-xs font-display font-semibold text-dungeon-400 uppercase tracking-widest mb-2">
              Base URL
            </label>
            <input
              id="base-url-input"
              type="url"
              value={store.baseUrl}
              onChange={(e) => store.setBaseUrl(e.target.value)}
              placeholder="http://localhost:11434"
              className="w-full bg-dungeon-900/80 border border-dungeon-700/60 rounded-lg px-3 py-2.5 text-sm text-dungeon-200 placeholder:text-dungeon-600 focus:outline-none focus:border-dungeon-500/80 font-mono"
            />
          </div>
        )}

        {/* WebLLM info */}
        {store.provider === 'webllm' && webGPUAvailable && (
          <div className="flex items-start gap-2.5 p-3 bg-arcane-950/40 border border-arcane-800/40 rounded-lg">
            <Zap size={14} className="text-arcane-400 shrink-0 mt-0.5" />
            <p className="text-arcane-400 text-xs leading-relaxed">
              The model will be downloaded to your browser on first use (~1-2 GB). Subsequent sessions use the cached version.
              No API key required.
            </p>
          </div>
        )}

        {/* Save button */}
        <Button
          variant="primary"
          size="md"
          className="w-full"
          onClick={() => store.setSettingsOpen(false)}
        >
          Save & Close
        </Button>
      </div>
    </Modal>
  );
}
