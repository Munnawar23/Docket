import { STORAGE_KEYS, zustandStorage } from "@/lib/storage/appStorage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeState {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      themeMode: "system",
      setThemeMode: (mode) => set({ themeMode: mode }),
    }),
    {
      name: STORAGE_KEYS.THEME,
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
