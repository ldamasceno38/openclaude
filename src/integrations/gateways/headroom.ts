import { defineGateway } from '../define.js'

export default defineGateway({
  id: 'headroom',
  label: 'Headroom',
  category: 'local',
  defaultBaseUrl: 'http://localhost:8787/v1',
  defaultModel: 'gpt-4o',
  setup: {
    requiresAuth: false,
    authMode: 'api-key',
    credentialEnvVars: ['HEADROOM_API_KEY', 'OPENAI_API_KEYS', 'OPENAI_API_KEY'],
  },
  validation: {
    kind: 'credential-env',
    routing: {
      matchDefaultBaseUrl: true,
      matchBaseUrlHosts: ['localhost:8787'],
    },
    credentialEnvVars: ['HEADROOM_API_KEY', 'OPENAI_API_KEYS', 'OPENAI_API_KEY'],
    missingCredentialMessage:
      'HEADROOM_API_KEY or OPENAI_API_KEY is required for Headroom proxy. Configure it via env var or /provider.',
    allowLocalBaseUrlWithoutCredential: true,
  },
  transportConfig: {
    kind: 'openai-compatible',
    openaiShim: {
      supportsAuthHeaders: true,
      maxTokensField: 'max_tokens',
    },
  },
  preset: {
    id: 'headroom',
    vendorId: 'openai',
    description: 'Headroom RTK compression proxy (localhost:8787)',
    label: 'Headroom',
    name: 'Headroom',
    apiKeyEnvVars: ['HEADROOM_API_KEY'],
    baseUrlEnvVars: ['HEADROOM_BASE_URL', 'OPENAI_BASE_URL'],
    modelEnvVars: ['OPENAI_MODEL'],
    fallbackBaseUrl: 'http://localhost:8787/v1',
    fallbackModel: 'gpt-4o',
    badge: {
      text: 'Local',
      color: 'neutral',
    },
  },
  catalog: {
    source: 'hybrid',
    discovery: {
      kind: 'openai-compatible',
      requiresAuth: true,
      path: '/v1/models',
      mapModel(raw: unknown) {
        if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
          return null
        }
        const model = raw as Record<string, unknown>
        const modelId = typeof model.id === 'string' ? model.id.trim() : ''
        if (!modelId) {
          return null
        }
        return {
          id: modelId,
          apiName: modelId,
          label: modelId,
        }
      },
    },
    discoveryCacheTtl: '1h',
    discoveryRefreshMode: 'startup',
    allowManualRefresh: true,
    models: [
      // OpenAI / common models
      { id: 'gpt-4o', apiName: 'gpt-4o', label: 'GPT-4o', contextWindow: 128_000 },
      { id: 'gpt-4o-mini', apiName: 'gpt-4o-mini', label: 'GPT-4o Mini', contextWindow: 128_000 },
      { id: 'gpt-4-turbo', apiName: 'gpt-4-turbo', label: 'GPT-4 Turbo', contextWindow: 128_000 },
      { id: 'gpt-4', apiName: 'gpt-4', label: 'GPT-4', contextWindow: 8_192 },
      { id: 'gpt-3.5-turbo', apiName: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', contextWindow: 16_385 },
      // DeepSeek
      { id: 'deepseek-v4-flash', apiName: 'deepseek-v4-flash', label: 'DeepSeek V4 Flash', contextWindow: 1_048_576 },
      { id: 'deepseek-v4-pro', apiName: 'deepseek-v4-pro', label: 'DeepSeek V4 Pro', contextWindow: 1_048_576 },
      // Qwen
      { id: 'qwen3.7-max', apiName: 'qwen3.7-max', label: 'Qwen 3.7 Max', contextWindow: 131_072 },
      { id: 'qwen3.7-plus', apiName: 'qwen3.7-plus', label: 'Qwen 3.7 Plus', contextWindow: 131_072 },
      // GLM
      { id: 'glm-5.2', apiName: 'glm-5.2', label: 'GLM 5.2', contextWindow: 128_000 },
      { id: 'glm-5.1', apiName: 'glm-5.1', label: 'GLM 5.1', contextWindow: 128_000 },
      // Kimi
      { id: 'kimi-k2.7-code', apiName: 'kimi-k2.7-code', label: 'Kimi K2.7 Code', contextWindow: 131_072 },
      { id: 'kimi-k2.6', apiName: 'kimi-k2.6', label: 'Kimi K2.6', contextWindow: 131_072 },
      // MiniMax
      { id: 'minimax-m3', apiName: 'minimax-m3', label: 'MiniMax M3', contextWindow: 1_048_576 },
      { id: 'minimax-m2.7', apiName: 'minimax-m2.7', label: 'MiniMax M2.7', contextWindow: 204_800 },
      // MiMo
      { id: 'mimo-v2.5-pro', apiName: 'mimo-v2.5-pro', label: 'MiMo V2.5 Pro', contextWindow: 128_000 },
      { id: 'mimo-v2.5', apiName: 'mimo-v2.5', label: 'MiMo V2.5', contextWindow: 128_000 },
      // Claude via proxy
      { id: 'claude-sonnet-4-6', apiName: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6', contextWindow: 200_000 },
      { id: 'claude-sonnet-4', apiName: 'claude-sonnet-4', label: 'Claude Sonnet 4', contextWindow: 200_000 },
      { id: 'claude-haiku-4', apiName: 'claude-haiku-4', label: 'Claude Haiku 4', contextWindow: 200_000 },
      // OpenRouter / other
      { id: 'accounts/fireworks/models/llama-v4-scout', apiName: 'accounts/fireworks/models/llama-v4-scout', label: 'Llama 4 Scout' },
      { id: 'accounts/fireworks/models/llama-v4-maverick', apiName: 'accounts/fireworks/models/llama-v4-maverick', label: 'Llama 4 Maverick' },
    ],
  },
  usage: { supported: false },
})
