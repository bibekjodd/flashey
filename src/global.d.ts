import Pusher from 'pusher-js';
export {};
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_PUSHER_APP_KEY: string;
    }
  }
  var __PUSHER__: Pusher | undefined;
}
