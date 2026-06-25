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
    models: [],
  },
  usage: { supported: false },
})
