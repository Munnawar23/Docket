import React, { useMemo } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  View,
  type Insets,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useAppTheme } from "@/hooks/useAppTheme";
import { hp, wp } from "@/helpers/responsiveHelper";
import { spacing, type ThemeColors } from "@/theme";

// ─── Props ────────────────────────────────────────────────────────────────────

export interface GlassIconButtonProps {
  onPress?: () => void;
  children: React.ReactNode;
  size?: number;
  style?: StyleProp<ViewStyle>;
  hitSlop?: Insets | number;
  disabled?: boolean;
  accessibilityLabel?: string;
  testID?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const GlassIconButton = React.memo(function GlassIconButton({
  onPress,
  children,
  size = wp(10.8),
  style,
  hitSlop = spacing.xs,
  disabled,
  accessibilityLabel,
  testID,
}: GlassIconButtonProps) {
  const { colors, isDark, isAestheticTheme } = useAppTheme();

  const styles = useMemo(
    () => createStyles(colors, isDark, size),
    [colors, isDark, size]
  );

  // Liquid glass specular light refraction sheen (iOS fluid glass reflection)
  const sheenColors = useMemo<[string, string, string]>(() => {
    if (isDark) {
      return [
        "rgba(255, 255, 255, 0.22)",
        "rgba(58, 58, 60, 0.35)",
        "rgba(28, 28, 30, 0.5)",
      ];
    }
    if (isAestheticTheme) {
      return [
        "rgba(255, 255, 255, 0.9)",
        "rgba(255, 255, 255, 0.45)",
        "rgba(255, 255, 255, 0.15)",
      ];
    }
    return [
      "rgba(255, 255, 255, 0.85)",
      "rgba(255, 255, 255, 0.35)",
      "rgba(230, 230, 238, 0.3)",
    ];
  }, [isDark, isAestheticTheme]);

  const blurIntensity = isDark ? 60 : isAestheticTheme ? 80 : 75;
  const blurTint = isDark ? "dark" : "light";

  const borderColor = isDark
    ? "rgba(255, 255, 255, 0.2)"
    : isAestheticTheme
      ? `${colors.border}E6`
      : `${colors.border}B3`;

  const glassBaseBg =
    Platform.OS === "android"
      ? isDark
        ? `${colors.card}B3`
        : isAestheticTheme
          ? `${colors.card}CC`
          : `${colors.card}99`
      : isDark
        ? "rgba(28, 28, 30, 0.35)"
        : isAestheticTheme
          ? "rgba(255, 255, 255, 0.35)"
          : "rgba(255, 255, 255, 0.35)";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={hitSlop}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      style={({ pressed }) => [
        styles.buttonWrapper,
        { borderColor },
        pressed && styles.buttonPressed,
        disabled && styles.buttonDisabled,
        style,
      ]}
    >
      {/* 1. Android & Fallback Translucent Underlay */}
      <View style={[styles.glassBase, { backgroundColor: glassBaseBg }]} />

      {/* 2. Expo Blur (iOS only) */}
      {Platform.OS === "ios" && (
        <BlurView
          intensity={blurIntensity}
          tint={blurTint}
          style={StyleSheet.absoluteFill}
        />
      )}

      {/* 3. Liquid Glass Specular Gradient */}
      <LinearGradient
        colors={sheenColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* 4. Icon Content */}
      <View style={styles.buttonContent}>{children}</View>
    </Pressable>
  );
});

export default GlassIconButton;

// ─── Styles ───────────────────────────────────────────────────────────────────

const createStyles = (colors: ThemeColors, isDark: boolean, size: number) =>
  StyleSheet.create({
    buttonWrapper: {
      width: size,
      height: size,
      borderRadius: size / 2,
      overflow: "hidden",
      borderWidth: 1,
      position: "relative",
      backgroundColor: "transparent",
      ...Platform.select({
        ios: {
          shadowColor: isDark ? "#000000" : colors.text,
          shadowOffset: { width: 0, height: hp(0.4) },
          shadowOpacity: isDark ? 0.25 : 0.08,
          shadowRadius: wp(1.6),
        },
        android: {
          elevation: 0,
        },
        web: {
          shadowColor: isDark ? "#000000" : colors.text,
          shadowOffset: { width: 0, height: hp(0.4) },
          shadowOpacity: isDark ? 0.25 : 0.08,
          shadowRadius: wp(1.6),
        },
      }),
    },
    glassBase: {
      ...(StyleSheet.absoluteFill as any),
    },
    buttonContent: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1,
    },
    buttonPressed: {
      opacity: 0.65,
      transform: [{ scale: 0.93 }],
    },
    buttonDisabled: {
      opacity: 0.4,
    },
  });
