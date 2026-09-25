import { useColorScheme } from "react-native";
import { AESTHETIC_THEMES, useThemeStore, type ThemeMode } from "@/store/themeStore";
import { theme, type ResolvedTheme, type ThemeColors, type ThemeFontFamily } from "@/theme";

export function useAppTheme() {
  const themeMode = useThemeStore((state) => state.themeMode);
  const setThemeMode = useThemeStore((state) => state.setThemeMode);
  const systemColorScheme = useColorScheme();

  const isAestheticTheme = AESTHETIC_THEMES.includes(themeMode);

  // Aesthetic themes bypass light/dark system entirely
  const resolvedTheme: ResolvedTheme = isAestheticTheme
    ? theme[themeMode as "rose" | "sky" | "sage"]
    : (() => {
        const activeScheme: "light" | "dark" =
          themeMode === "system"
            ? systemColorScheme === "dark"
              ? "dark"
              : "light"
            : (themeMode as "light" | "dark");
        return theme[activeScheme];
      })();

  const colors: ThemeColors = resolvedTheme.colors;
  const fontFamily: ThemeFontFamily = resolvedTheme.fontFamily;
  const isDark =
    !isAestheticTheme && (
      themeMode === "dark" ||
      (themeMode === "system" && systemColorScheme === "dark")
    );

  return {
    colors,
    fontFamily,
    isDark,
    isAestheticTheme,
    themeMode,
    setThemeMode,
    activeScheme: isAestheticTheme ? themeMode : (isDark ? "dark" : "light"),
    systemColorScheme: systemColorScheme ?? "light",
  };
}
