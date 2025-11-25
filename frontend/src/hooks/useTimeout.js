import { useEffect, useRef } from 'react';

/**
 * Custom hook for managing timeouts with automatic cleanup
 * Prevents memory leaks by clearing timeout on unmount
 */
export function useTimeout(callback, delay) {
  const timeoutIdRef = useRef(null);

  useEffect(() => {
    if (delay === null) return;

    timeoutIdRef.current = setTimeout(callback, delay);

    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, [callback, delay]);

  return () => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }
  };
}

/**
 * Custom hook for managing intervals with automatic cleanup
 * Prevents memory leaks by clearing interval on unmount
 */
export function useInterval(callback, delay) {
  const intervalIdRef = useRef(null);

  useEffect(() => {
    if (delay === null) return;

    intervalIdRef.current = setInterval(callback, delay);

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [callback, delay]);

  return () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }
  };
}

/**
 * Custom hook for managing event listeners with automatic cleanup
 */
export function useEventListener(eventName, handler, element = window) {
  useEffect(() => {
    const isSupported = element && element.addEventListener;
    if (!isSupported) return;

    const eventListener = (event) => handler(event);
    element.addEventListener(eventName, eventListener);

    return () => {
      element.removeEventListener(eventName, eventListener);
    };
  }, [eventName, handler, element]);
}

export default useTimeout;
