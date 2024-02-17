import Pusher from 'pusher-js';
const initializePusher = (): Pusher => {
  if (!globalThis.__PUSHER__) {
    globalThis.__PUSHER__ = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
      cluster: 'mt1'
    });
  }
  return globalThis.__PUSHER__;
};
export const pusher = initializePusher();
