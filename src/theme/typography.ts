import { moderateScale } from "react-native-size-matters";

// ─── Font Families ───────────────────────────────────────────────────────
export const fontFamily = {
  regular: "PlusJakartaSans-Regular",
  medium: "PlusJakartaSans-Medium",
  semiBold: "PlusJakartaSans-SemiBold",
  bold: "PlusJakartaSans-Bold",

  // Semantic aliases for consistency
  heading: "PlusJakartaSans-Bold",
  title: "PlusJakartaSans-SemiBold",
  text: "PlusJakartaSans-Regular",
};

// ─── Semantic Font Sizes (pre-scaled) ────────────────────────────────────
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
