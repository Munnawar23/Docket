import { useColorScheme } from "react-native";
import { useThemeStore, type ThemeMode } from "@/store/themeStore";
import { theme, type ThemeColors } from "@/theme/theme";

export function useAppTheme() {
  const themeMode = useThemeStore((state) => state.themeMode);
  const setThemeMode = useThemeStore((state) => state.setThemeMode);
  const systemColorScheme = useColorScheme();

  const activeScheme: "light" | "dark" =
    themeMode === "system"
      ? systemColorScheme === "dark"
        ? "dark"
        : "light"
      : themeMode;

  const isDark = activeScheme === "dark";
  const currentTheme = theme[activeScheme];
  const colors: ThemeColors = currentTheme.colors;

  return {
    theme: currentTheme,
    colors,
    isDark,
    themeMode,
    setThemeMode,
    activeScheme,
    systemColorScheme: systemColorScheme ?? "light",
  };
}
