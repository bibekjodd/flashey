import { useEffect } from 'react';

export const useInterval = <T = unknown>(
  callback: () => T,
  time = 1000,
  enabled = true
) => {
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (!enabled) return;

    interval = setInterval(callback, time);
    return () => {
      interval && clearInterval(interval);
    };
  }, [callback, time, enabled]);

  return null;
};
