import {
  butterColors,
  darkColors,
  lightColors,
  roseColors,
  skyColors,
  type ThemeColors,
} from "./colors";
import { spacing, type ThemeSpacing } from "./spacing";
import {
  fontFamily,
  fontSize,
  aestheticFontFamily,
  type ThemeFontFamily,
  type ThemeFontSize,
} from "./typography";

// ─── Theme Entries ─────────────────────────────────────────────────────────────

export const theme = {
  // Standard themes — respect system light/dark
  light: {
    colors: lightColors,
    fontFamily,
  },
  dark: {
    colors: darkColors,
    fontFamily,
  },

  // Aesthetic themes — standalone, fixed palette + aesthetic fonts
  rose: {
    colors: roseColors,
    fontFamily: aestheticFontFamily,
  },
  sky: {
    colors: skyColors,
    fontFamily: aestheticFontFamily,
  },
  butter: {
    colors: butterColors,
    fontFamily: aestheticFontFamily,
  },
};

export type ResolvedTheme = {
  colors: ThemeColors;
  fontFamily: ThemeFontFamily;
};

export { darkColors, lightColors, roseColors, skyColors, butterColors };
export { spacing, fontFamily, aestheticFontFamily, fontSize };
export type { ThemeColors, ThemeSpacing, ThemeFontFamily, ThemeFontSize };
export type AppTheme = typeof theme;
