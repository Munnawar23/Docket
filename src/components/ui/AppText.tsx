import React, { forwardRef } from "react";
import {
  Text as RNText,
  type TextProps,
  type TextStyle,
  type StyleProp,
} from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { rs } from "@/helpers/responsiveHelper";
import {
  fontSize,
  lineHeight,
  letterSpacing,
  type ThemeFontSize,
  type ThemeFontFamily,
  type ThemeColors,
} from "@/theme";

export type TextVariant = keyof ThemeFontSize;
export type TextWeight = keyof ThemeFontFamily;
export type TextColor = keyof ThemeColors | (string & {});

export interface AppTextProps extends Omit<TextProps, "style"> {
  /**
   * Predefined typography preset combining font size, line height, letter spacing, and font family.
   * Options: 'caption' | 'bodySm' | 'body' | 'bodyLg' | 'title' | 'cardTitle' | 'heading'
   * @default 'body'
   */
  variant?: TextVariant;

  /**
   * Text color from theme ('text' | 'subtext' | 'primary' | 'card' | 'background' | 'border') or custom hex/rgb.
   * @default 'text'
   */
  color?: TextColor;

  /** Optional font size override (ThemeFontSize key or custom number) */
  size?: TextVariant | number;

  /** Optional line height override */
  lineHeight?: number;

  /** Optional letter spacing override */
  letterSpacing?: number;

  /** Optional font family / weight override */
  family?: TextWeight;
  fontFamily?: TextWeight;

  /** Shorthand weight flags */
  bold?: boolean;
  semiBold?: boolean;
  medium?: boolean;

  /** Text alignment shorthand */
  align?: TextStyle["textAlign"];

  /** Additional custom text styles (overrides defaults) */
  style?: StyleProp<TextStyle>;

  children?: React.ReactNode;
}

export const AppText = forwardRef<RNText, AppTextProps>(function AppText(
  {
    variant = "body",
    color = "text",
    size,
    lineHeight: customLineHeight,
    letterSpacing: customLetterSpacing,
    family,
    fontFamily: fontFamilyProp,
    bold,
    semiBold,
    medium,
    align,
    style,
    children,
    maxFontSizeMultiplier = 1.2,
    ...rest
  },
  ref
) {
  const { colors, fontFamily } = useAppTheme();

  // 1. Resolve Font Size (from variant, or size override with moderate scale)
  const resolvedSize =
    typeof size === "number"
      ? rs.font(size)
      : size && size in fontSize
      ? fontSize[size as keyof ThemeFontSize]
      : fontSize[variant] ?? fontSize.body;

  // 2. Resolve Line Height (paired with font size to prevent vertical clipping)
  const resolvedLineHeight =
    typeof customLineHeight === "number"
      ? customLineHeight
      : typeof size === "number"
      ? Math.round(resolvedSize * 1.35)
      : size && size in lineHeight
      ? lineHeight[size as keyof ThemeFontSize]
      : lineHeight[variant] ?? lineHeight.body;

  // 3. Resolve Letter Spacing
  const resolvedLetterSpacing =
    typeof customLetterSpacing === "number"
      ? customLetterSpacing
      : size && size in letterSpacing
      ? letterSpacing[size as keyof ThemeFontSize]
      : letterSpacing[variant] ?? 0;

  // 4. Resolve Font Family & Weight (from variant, or family/flags override)
  const defaultWeight: TextWeight =
    variant === "heading"
      ? "heading"
      : variant === "cardTitle" || variant === "title"
      ? "title"
      : "regular";

  const selectedWeight: TextWeight = bold
    ? "bold"
    : semiBold
    ? "semiBold"
    : medium
    ? "medium"
    : fontFamilyProp ?? family ?? defaultWeight;

  const resolvedFontFamily =
    fontFamily[selectedWeight] ?? fontFamily.regular;

  // 5. Resolve Color (theme token or direct string)
  const resolvedColor =
    color && color in colors
      ? colors[color as keyof ThemeColors]
      : color || colors.text;

  const baseStyle: TextStyle = {
    color: resolvedColor,
    fontSize: resolvedSize,
    lineHeight: resolvedLineHeight,
    letterSpacing: resolvedLetterSpacing,
    fontFamily: resolvedFontFamily,
    ...(align ? { textAlign: align } : {}),
  };

  return (
    <RNText
      ref={ref}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      style={[baseStyle, style]}
      {...rest}
    >
      {children}
    </RNText>
  );
});

export default AppText;
