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

// ─── Aesthetic Theme Font Family (Boogaloo + Nunito) ──────────────────────────
export const aestheticFontFamily = {
  regular: "Nunito-Regular",
  medium: "Nunito-Regular",
  semiBold: "Nunito-SemiBold",
  bold: "Nunito-Bold",

  // Semantic aliases — Boogaloo for headings, Nunito for everything else
  heading: "Boogaloo-Regular",
  title: "Boogaloo-Regular",
  text: "Nunito-Regular",
};

// ─── Semantic Font Sizes (pre-scaled with rs.font) ───────────────────────────
export const fontSize = {
  caption: rs.font(12),
  bodySm: rs.font(13),
  body: rs.font(14),
  bodyLg: rs.font(16),
  title: rs.font(18),
  cardTitle: rs.font(20),
  heading: rs.font(24),
  largeTitle: rs.font(34),
};

// ─── Semantic Line Heights (paired with fontSize to prevent text clipping) ───
export const lineHeight = {
  caption: Math.round(fontSize.caption * 1.4),
  bodySm: Math.round(fontSize.bodySm * 1.4),
  body: Math.round(fontSize.body * 1.4),
  bodyLg: Math.round(fontSize.bodyLg * 1.4),
  title: Math.round(fontSize.title * 1.35),
  cardTitle: Math.round(fontSize.cardTitle * 1.35),
  heading: Math.round(fontSize.heading * 1.3),
  largeTitle: Math.round(fontSize.largeTitle * 1.25),
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
  aestheticFontFamily,
  fontSize,
  lineHeight,
  letterSpacing,
  fontWeight,
};

export type ThemeFontSize = typeof fontSize;
export type ThemeLineHeight = typeof lineHeight;
export type ThemeLetterSpacing = typeof letterSpacing;
export type ThemeFontWeight = typeof fontWeight;
export type ThemeFontFamily = typeof fontFamily;
export type Fonts = typeof fonts;
