import { useRef, useEffect, useCallback } from 'react';

function useThrottle<T extends (...args: any[]) => void>(
  callback: T,
  interval: number
): T {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      if (!timerRef.current) {
        callback(...args);
        timerRef.current = setTimeout(() => {
          timerRef.current = null;
        }, interval);
      }
    },
    [callback, interval]
  ) as T;

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [interval]);

  return throttledCallback;
}

export default useThrottle;
