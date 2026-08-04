/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Backend API manzili. Bo'sh bo'lsa `/api` (Vite proxy) ishlatiladi. */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
