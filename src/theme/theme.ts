import {
  darkColors,
  lightColors,
  roseColors,
  sageColors,
  skyColors,
  type ThemeColors,
} from "./colors";
import {
  fontFamily,
  aestheticFontFamily,
  type ThemeFontFamily,
} from "./fonts";

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
  sage: {
    colors: sageColors,
    fontFamily: aestheticFontFamily,
  },
};

export type ResolvedTheme = {
  colors: ThemeColors;
  fontFamily: ThemeFontFamily;
};

export type AppTheme = typeof theme;
