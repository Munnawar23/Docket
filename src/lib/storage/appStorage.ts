import { createMMKV, type MMKV } from "react-native-mmkv";
import { StateStorage } from "zustand/middleware";

// ─── MMKV Instance ────────────────────────────────────────────────────────────

export const storage: MMKV = createMMKV({
  id: "docket-storage",
});

// ─── Storage Keys ─────────────────────────────────────────────────────────────

export const STORAGE_KEYS = {
  THEME: "theme-storage",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

// ─── Core Storage API ─────────────────────────────────────────────────────────

export const appStorage = {
  /**
   * Retrieve a parsed JSON object or primitive value from storage.
   */
  get<T>(key: string): T | null {
    try {
      const raw = storage.getString(key);
      if (raw == null) return null;
      try {
        return JSON.parse(raw) as T;
      } catch {
        return raw as unknown as T;
      }
    } catch (error) {
      console.error(`[appStorage] Error reading key "${key}":`, error);
      return null;
    }
  },

  /**
   * Save a JSON object or primitive value to storage.
   */
  set<T>(key: string, value: T): void {
    try {
      const raw = typeof value === "string" ? value : JSON.stringify(value);
      storage.set(key, raw);
    } catch (error) {
      console.error(`[appStorage] Error writing key "${key}":`, error);
    }
  },

  /**
   * Remove an item from storage by key.
   */
  remove(key: string): void {
    try {
      storage.remove(key);
    } catch (error) {
      console.error(`[appStorage] Error removing key "${key}":`, error);
    }
  },

  /**
   * Clear all items in storage.
   */
  clear(): void {
    try {
      storage.clearAll();
    } catch (error) {
      console.error("[appStorage] Error clearing storage:", error);
    }
  },

  /**
   * Check if key exists in storage.
   */
  contains(key: string): boolean {
    return storage.contains(key);
  },

  /**
   * Retrieve all keys in storage.
   */
  getAllKeys(): string[] {
    return storage.getAllKeys();
  },
};

// ─── Zustand Persist Adapter ──────────────────────────────────────────────────

/**
 * High-performance synchronous Zustand `StateStorage` adapter powered by MMKV.
 * Eliminates state rehydration flash/delay on startup.
 */
export const zustandStorage: StateStorage = {
  getItem: (name: string): string | null => {
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string): void => {
    storage.set(name, value);
  },
  removeItem: (name: string): void => {
    storage.remove(name);
  },
};

