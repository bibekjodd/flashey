/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  readonly VITE_PUSHER_KEY: string;
  readonly VITE_PUSHER_CLUSTER: string;
  readonly VITE_GOOGLE_AUTH: string;
}
