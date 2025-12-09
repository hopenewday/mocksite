/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_EDGE_CSV_URL: string
  readonly VITE_EDGE_ADMIN_USERS_URL: string
  readonly VITE_EDGE_ANALYTICS_URL: string
  readonly VITE_EDGE_ADMIN_TESTS_URL: string
  readonly VITE_CSRF_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>
  export default component
}

declare module 'virtual:pwa-register' {
  export function registerSW(options?: Record<string, unknown>): () => void
}

declare module '*.json' {
  const value: unknown;
  export default value;
}
