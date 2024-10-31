/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_CLOUD_NAME: string;
    readonly VITE_CLOUD_API_KEY: string;
    readonly VITE_CLOUD_API_SECRET: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  