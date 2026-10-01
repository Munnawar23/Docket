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
  fontSize,
  aestheticFontSize,
  lineHeight,
  aestheticLineHeight,
  type ThemeFontFamily,
  type ThemeFontSize,
  type ThemeLineHeight,
} from "./fonts";

// ─── Theme Entries ─────────────────────────────────────────────────────────────

export const theme = {
  // Standard themes — respect system light/dark
  light: {
    colors: lightColors,
    fontFamily,
    fontSize,
    lineHeight,
  },
  dark: {
    colors: darkColors,
    fontFamily,
    fontSize,
    lineHeight,
  },

  // Aesthetic themes — standalone, fixed palette + aesthetic fonts
  rose: {
    colors: roseColors,
    fontFamily: aestheticFontFamily,
    fontSize: aestheticFontSize,
    lineHeight: aestheticLineHeight,
  },
  sky: {
    colors: skyColors,
    fontFamily: aestheticFontFamily,
    fontSize: aestheticFontSize,
    lineHeight: aestheticLineHeight,
  },
  sage: {
    colors: sageColors,
    fontFamily: aestheticFontFamily,
    fontSize: aestheticFontSize,
    lineHeight: aestheticLineHeight,
  },
};

export type ResolvedTheme = {
  colors: ThemeColors;
  fontFamily: ThemeFontFamily;
  fontSize: ThemeFontSize;
  lineHeight: ThemeLineHeight;
};

export type AppTheme = typeof theme;
