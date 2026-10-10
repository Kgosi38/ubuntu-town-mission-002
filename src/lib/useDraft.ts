"use client";
import { useCallback, useEffect, useRef } from "react";

/**
 * Lightweight draft persistence with localStorage.
 * Trade-off: survives refresh, lost connection and closed tabs on THIS phone/browser,
 * but is not synced across devices and is cleared if the user wipes browser data.
 */
export function useDraft<T>(key: string | undefined) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback((): T | null => {
    if (!key) return null;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null; // storage blocked or corrupt: behave as "no draft"
    }
  }, [key]);

  const save = useCallback(
    (value: T) => {
      if (!key) return;
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        try {
          window.localStorage.setItem(key, JSON.stringify(value));
        } catch {
          /* storage full or blocked: ignore, the form still works */
        }
      }, 400);
    },
    [key],
  );

  const clear = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    if (!key) return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  }, [key]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return { load, save, clear };
}
