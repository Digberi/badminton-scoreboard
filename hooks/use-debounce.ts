import {useCallback, useRef} from 'react';

export function useDebounceCallback<T extends (...args: any[]) => void>(callback: T, delay: number): (...args: Parameters<T>) => void {
  const timer = useRef<NodeJS.Timeout | null>(null);

  return useCallback((...args: Parameters<T>) => {
    if (timer.current) {
      clearTimeout(timer.current); // Clear the previous timer
    }

    timer.current = setTimeout(() => {
      callback(...args); // Execute the callback after the delay
    }, delay);
  }, [callback, delay]);
}
