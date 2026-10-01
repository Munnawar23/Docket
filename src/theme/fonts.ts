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

// ─── Aesthetic Semantic Font Sizes (Boogaloo + Nunito Optical Scale) ─────────
export const aestheticFontSize = {
  caption: rs.font(13),
  bodySm: rs.font(14),
  body: rs.font(15),
  bodyLg: rs.font(16.5),
  title: rs.font(20),
  cardTitle: rs.font(23),
  heading: rs.font(30),
  largeTitle: rs.font(44),
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

// ─── Aesthetic Semantic Line Heights ─────────────────────────────────────────
export const aestheticLineHeight = {
  caption: Math.round(aestheticFontSize.caption * 1.4),
  bodySm: Math.round(aestheticFontSize.bodySm * 1.4),
  body: Math.round(aestheticFontSize.body * 1.4),
  bodyLg: Math.round(aestheticFontSize.bodyLg * 1.4),
  title: Math.round(aestheticFontSize.title * 1.25),
  cardTitle: Math.round(aestheticFontSize.cardTitle * 1.25),
  heading: Math.round(aestheticFontSize.heading * 1.25),
  largeTitle: Math.round(aestheticFontSize.largeTitle * 1.25),
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

// ─── Aesthetic Semantic Letter Spacing ────────────────────────────────────────
export const aestheticLetterSpacing = {
  caption: 0.2,
  bodySm: 0.1,
  body: 0,
  bodyLg: -0.1,
  title: 0.2,
  cardTitle: 0.2,
  heading: 0.2,
  largeTitle: 0.2,
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
  aestheticFontSize,
  lineHeight,
  aestheticLineHeight,
  letterSpacing,
  aestheticLetterSpacing,
  fontWeight,
};

export type ThemeFontSize = typeof fontSize;
export type ThemeLineHeight = typeof lineHeight;
export type ThemeLetterSpacing = typeof letterSpacing;
export type ThemeFontWeight = typeof fontWeight;
export type ThemeFontFamily = typeof fontFamily;
export type Fonts = typeof fonts;
