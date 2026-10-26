import { useColorScheme } from "react-native";
import { useThemeStore, type ThemeMode } from "@/store/themeStore";
import {
  theme,
  type ResolvedTheme,
  type ThemeColors,
  type ThemeFontFamily,
  type ThemeFontSize,
} from "@/theme";

export function useAppTheme() {
  const themeMode = useThemeStore((state) => state.themeMode);
  const setThemeMode = useThemeStore((state) => state.setThemeMode);
  const systemColorScheme = useColorScheme();

  const activeScheme: "light" | "dark" =
    themeMode === "system"
      ? systemColorScheme === "dark"
        ? "dark"
        : "light"
      : (themeMode as "light" | "dark");

  const resolvedTheme: ResolvedTheme = theme[activeScheme];

  const colors: ThemeColors = resolvedTheme.colors;
  const fontFamily: ThemeFontFamily = resolvedTheme.fontFamily;
  const fontSize: ThemeFontSize = resolvedTheme.fontSize;
  const isDark = activeScheme === "dark";

  return {
    colors,
    fontFamily,
    fontSize,
    isDark,
    themeMode,
    setThemeMode,
    activeScheme,
    systemColorScheme,
  };
}
