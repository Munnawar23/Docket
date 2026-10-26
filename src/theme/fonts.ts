import { rs } from "@/helpers/responsiveHelper";

// ─── Default Font Families (Plus Jakarta Sans) ────────────────────────────────
export const fontFamily = {
  regular: "PlusJakartaSans-Regular",
  medium: "PlusJakartaSans-Medium",
  semiBold: "PlusJakartaSans-SemiBold",
  bold: "PlusJakartaSans-Bold",

  // Semantic aliases
  heading: "PlusJakartaSans-Bold",
  title: "PlusJakartaSans-SemiBold",
  text: "PlusJakartaSans-Regular",
};

// ─── Semantic Font Sizes (Plus Jakarta Sans) ─────────────────────────────────
export const fontSize = {
  caption: rs.font(12),
  bodySm: rs.font(13),
  body: rs.font(14),
  bodyLg: rs.font(15),
  title: rs.font(18),
  cardTitle: rs.font(20),
  heading: rs.font(24),
  largeTitle: rs.font(34),
};

// ─── Semantic Letter Spacing ──────────────────────────────────────────────────
export const letterSpacing = {
  caption: 0.2,
  bodySm: 0.1,
  body: 0,
  bodyLg: -0.1,
  title: -0.3,
  cardTitle: -0.4,
  heading: -0.5,
  largeTitle: -0.5,
};

// ─── Font Weights ─────────────────────────────────────────────────────────────
export const fontWeight = {
  regular: "400",
  medium: "500",
  semiBold: "600",
  bold: "700",
} as const;

export const fonts = {
  fontFamily,
  fontSize,
  letterSpacing,
  fontWeight,
};

export type ThemeFontSize = typeof fontSize;
export type ThemeLetterSpacing = typeof letterSpacing;
export type ThemeFontWeight = typeof fontWeight;
export type ThemeFontFamily = typeof fontFamily;
export type Fonts = typeof fonts;
