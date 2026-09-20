import AsyncStorage from "@react-native-async-storage/async-storage";
import { StateStorage } from "zustand/middleware";

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
  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(key);
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
   * Save a JSON object or string value to storage.
   */
  async set<T>(key: string, value: T): Promise<void> {
    try {
      const raw = typeof value === "string" ? value : JSON.stringify(value);
      await AsyncStorage.setItem(key, raw);
    } catch (error) {
      console.error(`[appStorage] Error writing key "${key}":`, error);
    }
  },

  /**
   * Remove an item from storage by key.
   */
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`[appStorage] Error removing key "${key}":`, error);
    }
  },

  /**
   * Clear all items in storage.
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error("[appStorage] Error clearing storage:", error);
    }
  },
};

// ─── Zustand Persist Adapter ──────────────────────────────────────────────────

/**
 * Zustand `StateStorage` adapter configured for `@react-native-async-storage/async-storage`.
 */
export const zustandStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const value = await AsyncStorage.getItem(name);
    return value ?? null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await AsyncStorage.setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await AsyncStorage.removeItem(name);
  },
};
