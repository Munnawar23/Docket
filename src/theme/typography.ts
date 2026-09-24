import { rs } from "@/helpers/responsive.utils";

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
  caption: rs.font(12),
  bodySm: rs.font(13),
  body: rs.font(14),
  bodyLg: rs.font(16),
  title: rs.font(18),
  cardTitle: rs.font(20),
  heading: rs.font(24),
};

export type ThemeFontSize = typeof fontSize;
export type ThemeFontFamily = typeof fontFamily;
