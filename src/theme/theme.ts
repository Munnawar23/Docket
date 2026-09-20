import { darkColors, lightColors, type ThemeColors } from "./colors";
import { spacing, type ThemeSpacing } from "./spacing";
import { fontFamily, fontSize, type ThemeFontFamily, type ThemeFontSize } from "./typography";

export const theme = {
  light: {
    colors: lightColors,
  },
  dark: {
    colors: darkColors,
  },
};

export { darkColors, lightColors, spacing, fontFamily, fontSize };
export type { ThemeColors, ThemeSpacing, ThemeFontFamily, ThemeFontSize };
export type AppTheme = typeof theme;
