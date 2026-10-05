import AsyncStorage from "@react-native-async-storage/async-storage";
import { StateStorage } from "zustand/middleware";

export const STORAGE_KEYS = {
  THEME: "theme-storage",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
export type AppStorageKey = StorageKey | (string & {});

export const appStorage = {
  async get<T>(key: AppStorageKey): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(key);
      return raw != null ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },

  async set<T>(key: AppStorageKey, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },

  getString: async (key: AppStorageKey): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  },

  setString: async (key: AppStorageKey, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch {}
  },

  remove: async (key: AppStorageKey): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch {}
  },

  delete: async (key: AppStorageKey): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch {}
  },

  clear: async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
    } catch {}
  },

  getAllKeys: async (): Promise<readonly string[]> => {
    try {
      return await AsyncStorage.getAllKeys();
    } catch {
      return [];
    }
  },
};

/**
 * Zustand StateStorage adapter for AsyncStorage.
 * Zustand's createJSONStorage supports Promise-returning StateStorage methods.
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

