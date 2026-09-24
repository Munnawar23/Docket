import { useAppTheme } from "@/hooks/useAppTheme";
import { Haptics } from "@/lib/haptics";
import { spacing } from "@/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { scale, verticalScale } from "@/helpers/responsive.utils";
import SearchBar from "./SearchBar";

const BUTTON_SIZE = scale(40);

export const Header = React.memo(function Header() {
  const { colors, isDark, isAestheticTheme } = useAppTheme();
  const navigation = useNavigation<any>();

  const handleOpenDrawer = useCallback(() => {
    Haptics.light();
    navigation.toggleDrawer?.();
  }, [navigation]);

  const handleProfilePress = useCallback(() => {
    Haptics.light();
    console.log("[Header] Profile pressed");
  }, []);

  return (
    <View style={styles.container}>
      {/* Drawer Toggle */}
      <GlassIconButton
        isDark={isDark}
        isAestheticTheme={isAestheticTheme}
        onPress={handleOpenDrawer}
      >
        <Ionicons
          name="reorder-four-outline"
          size={spacing.iconMd}
          color={colors.text}
        />
      </GlassIconButton>

      {/* Search Bar */}
      <View style={styles.searchBarWrapper}>
        <SearchBar />
      </View>

      {/* Profile */}
      <GlassIconButton
        isDark={isDark}
        isAestheticTheme={isAestheticTheme}
        onPress={handleProfilePress}
      >
        <Ionicons
          name="person-outline"
          size={spacing.iconMd}
          color={colors.text}
        />
      </GlassIconButton>
    </View>
  );
});

export default Header;

// ─── Glass Icon Button ────────────────────────────────────────────────────────

type GlassIconButtonProps = {
  isDark: boolean;
  isAestheticTheme: boolean;
  onPress: () => void;
  children: React.ReactNode;
};

function GlassIconButton({
  isDark,
  isAestheticTheme,
  onPress,
  children,
}: GlassIconButtonProps) {
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
      ? "rgba(255, 255, 255, 0.9)"
      : "rgba(255, 255, 255, 0.85)";

  const glassBaseBg =
    Platform.OS === "android"
      ? isDark
        ? "rgba(30, 30, 34, 0.68)"
        : isAestheticTheme
          ? "rgba(255, 255, 255, 0.55)"
          : "rgba(255, 255, 255, 0.6)"
      : isDark
        ? "rgba(28, 28, 30, 0.35)"
        : isAestheticTheme
          ? "rgba(255, 255, 255, 0.35)"
          : "rgba(255, 255, 255, 0.35)";

  return (
    <Pressable
      onPress={onPress}
      hitSlop={spacing.xs}
      style={({ pressed }) => [
        styles.buttonWrapper,
        { borderColor },
        pressed && styles.buttonPressed,
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
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.vSm,
    paddingBottom: spacing.vXs,
    gap: spacing.sm,
  },
  searchBarWrapper: {
    flex: 1,
  },
  buttonWrapper: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    overflow: "hidden",
    borderWidth: 1,
    position: "relative",
    backgroundColor: "transparent",
    ...Platform.select({
      ios: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: verticalScale(3) },
        shadowOpacity: 0.08,
        shadowRadius: scale(6),
      },
      android: {
        elevation: 0,
      },
      web: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: verticalScale(3) },
        shadowOpacity: 0.08,
        shadowRadius: scale(6),
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
});
