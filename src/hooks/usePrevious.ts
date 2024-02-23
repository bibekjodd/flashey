import { useEffect, useRef } from 'react';

export const usePrevious = <T = unknown>(value: T): T | null => {
  const previous = useRef<T | null>(null);
  useEffect(() => {
    previous.current = value;
  }, [value]);

  return previous.current;
};
