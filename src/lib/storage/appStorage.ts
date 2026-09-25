import { createMMKV, type MMKV } from "react-native-mmkv";
import { StateStorage } from "zustand/middleware";

export const storage: MMKV = createMMKV({ id: "docket-storage" });

export const STORAGE_KEYS = {
  THEME: "theme-storage",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
export type AppStorageKey = StorageKey | (string & {});

export const appStorage = {
  get<T>(key: AppStorageKey): T | null {
    try {
      const raw = storage.getString(key);
      return raw != null ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },

  set<T>(key: AppStorageKey, value: T): void {
    try {
      storage.set(key, JSON.stringify(value));
    } catch {}
  },

  getString: (key: AppStorageKey): string | null => storage.getString(key) ?? null,
  setString: (key: AppStorageKey, value: string): void => storage.set(key, value),

  remove: (key: AppStorageKey): boolean => storage.remove(key),
  delete: (key: AppStorageKey): boolean => storage.remove(key),

  contains: (key: AppStorageKey): boolean => storage.contains(key),
  has: (key: AppStorageKey): boolean => storage.contains(key),

  clear: (): void => storage.clearAll(),
  getAllKeys: (): string[] => storage.getAllKeys(),
};

/**
 * Synchronous Zustand StateStorage adapter.
 * Zustand handles its own JSON serialization, so we use raw MMKV strings directly.
 */
export const zustandStorage: StateStorage = {
  getItem: (name) => storage.getString(name) ?? null,
  setItem: (name, value) => storage.set(name, value),
  removeItem: (name) => storage.remove(name),
};

