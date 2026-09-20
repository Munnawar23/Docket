import { moderateScale } from "react-native-size-matters";

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
  medium: "Nunito-Regular",       // Nunito has no Medium — fallback to Regular
  semiBold: "Nunito-SemiBold",
  bold: "Nunito-Bold",

  // Semantic aliases — Boogaloo for headings, Nunito for everything else
  heading: "Boogaloo-Regular",
  title: "Boogaloo-Regular",
  text: "Nunito-Regular",
};

// ─── Semantic Font Sizes (pre-scaled) ────────────────────────────────────────
export const fontSize = {
  caption: moderateScale(12),
  bodySm: moderateScale(13),
  body: moderateScale(14),
  bodyLg: moderateScale(16),
  title: moderateScale(18),
  cardTitle: moderateScale(20),
  heading: moderateScale(24),
};

export type ThemeFontSize = typeof fontSize;
export type ThemeFontFamily = typeof fontFamily;
