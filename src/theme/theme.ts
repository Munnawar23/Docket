import {
  darkColors,
  lightColors,
  type ThemeColors,
} from "./colors";
import {
  fontFamily,
  fontSize,
  type ThemeFontFamily,
  type ThemeFontSize,
} from "./fonts";

// ─── Theme Entries ─────────────────────────────────────────────────────────────

export const theme = {
  // Standard themes — respect system light/dark
  light: {
    colors: lightColors,
    fontFamily,
    fontSize,
  },
  dark: {
    colors: darkColors,
    fontFamily,
    fontSize,
  },
};

export type ResolvedTheme = {
  colors: ThemeColors;
  fontFamily: ThemeFontFamily;
  fontSize: ThemeFontSize;
};

export type AppTheme = typeof theme;
