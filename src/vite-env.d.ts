/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_REAL_API: string
  readonly VITE_SHOW_DEBUG?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}