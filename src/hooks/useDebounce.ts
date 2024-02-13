import { useEffect, useState } from 'react';

export const useDebounce = (value: any, delay: number = 200) => {
  const [canStart, setCanStart] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setCanStart(true);
    }, delay);
    return () => {
      timeout && clearTimeout(timeout);
      setCanStart(false);
    };
  }, [value, delay]);
  return canStart;
};
