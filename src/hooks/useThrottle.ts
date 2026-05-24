import { useRef, useEffect, useCallback } from 'react';

function useThrottle<T extends (...args: any[]) => void>(
  callback: T,
  interval: number
): T {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);
  const trailingArgsRef = useRef<Parameters<T> | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      if (!timerRef.current) {
        // 처음 이벤트 발생 시 즉시 실행 (Leading edge)
        callbackRef.current(...args);
        
        timerRef.current = setTimeout(() => {
          // 타이머가 끝났을 때, 마지막으로 들어온 인자가 있다면 한 번 더 실행 (Trailing edge)
          if (trailingArgsRef.current) {
            callbackRef.current(...trailingArgsRef.current);
            trailingArgsRef.current = null;
          }
          timerRef.current = null;
        }, interval);
      } else {
        // 타이머가 도는 중이라면 마지막 인자를 기억
        trailingArgsRef.current = args;
      }
    },
    [interval]
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
