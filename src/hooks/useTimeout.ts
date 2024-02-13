import { useEffect } from 'react';

export const useTimeout = (
  callback: () => unknown,
  wait = 1000,
  enabled = true
) => {
  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    if (!enabled) {
      timeout && clearTimeout(timeout);
      return;
    }

    timeout = setTimeout(() => {
      callback();
    }, wait);

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [callback, wait, enabled]);
};
