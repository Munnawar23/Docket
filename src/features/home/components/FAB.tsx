import { useAppTheme } from "@/hooks/useAppTheme";
import { Haptics } from "@/lib/haptics";
import type { ThemeColors } from "@/theme/colors";
import { spacing } from "@/theme/theme";
import { fontSize } from "@/theme/typography";
import type { ThemeFontFamily } from "@/theme/typography";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  type StyleProp,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from "react-native";
import Animated, {
  interpolate,
  Extrapolation,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  type SharedValue,
} from "react-native-reanimated";
import { scale, verticalScale } from "react-native-size-matters";

const FAB_SIZE = scale(48);
const PILL_HEIGHT = verticalScale(46);
const PILL_WIDTH = scale(134);
const PILL_GAP = verticalScale(10);
const PILL_OFFSET_Y = verticalScale(14); // slide-in distance
const STAGGER_MS = 60; // delay between each pill on open

// Spring configs — tuned for 120 fps feel
const BACKDROP_SPRING = { damping: 20, stiffness: 160, mass: 0.8 };
const ICON_SPRING     = { damping: 14, stiffness: 320, mass: 0.55 };
const PILL_SPRING     = { damping: 15, stiffness: 280, mass: 0.6 };
const CLOSE_SPRING    = { damping: 22, stiffness: 340, mass: 0.55 };

// ─── Types ───────────────────────────────────────────────────────────────────

type FABOptionId = "note" | "task";

type FABOption = {
  id: FABOptionId;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const FAB_OPTIONS: FABOption[] = [
  { id: "note", label: "Note", icon: "document-text-outline" },
  { id: "task", label: "Task", icon: "checkbox-outline" },
];

export interface FABProps {
  onAddNote?: () => void;
  onAddTask?: () => void;
  bottomOffset?: number;
  style?: StyleProp<ViewStyle>;
}

// ─── FAB ─────────────────────────────────────────────────────────────────────

export const FAB = React.memo(function FAB({
  onAddNote,
  onAddTask,
  bottomOffset = verticalScale(24),
  style,
}: FABProps = {}) {
  const { colors, fontFamily, isDark, isAestheticTheme } = useAppTheme();
  const styles = useMemo(
    () => createStyles(colors, fontFamily, isDark, isAestheticTheme),
    [colors, fontFamily, isDark, isAestheticTheme]
  );

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

  // Separate shared value per concern — all live on UI thread
  const backdropProgress = useSharedValue(0);
  const iconProgress     = useSharedValue(0);
  // One shared value per pill — explicit (rules of hooks: no hooks in loops)
  const pill0 = useSharedValue(0);
  const pill1 = useSharedValue(0);
  const pillProgress = useMemo(() => [pill0, pill1], [pill0, pill1]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Track open state for pointerEvents (JS state, never .value in render)
  useAnimatedReaction(
    () => backdropProgress.value,
    (cur, prev) => {
      if (cur !== prev) runOnJS(setIsMenuOpen)(cur > 0.05);
    }
  );

  const openMenu = useCallback(() => {
    Haptics.light();
    backdropProgress.value = withSpring(1, BACKDROP_SPRING);
    iconProgress.value     = withSpring(1, ICON_SPRING);
    // Stagger: pill0 fires immediately, pill1 fires after STAGGER_MS
    pill0.value = withSpring(1, PILL_SPRING);
    pill1.value = withDelay(STAGGER_MS, withSpring(1, PILL_SPRING));
  }, [backdropProgress, iconProgress, pill0, pill1]);

  const closeMenu = useCallback(() => {
    Haptics.light();
    // Reverse stagger on close: pill1 first, then pill0
    pill1.value = withSpring(0, CLOSE_SPRING);
    pill0.value = withDelay(STAGGER_MS, withSpring(0, CLOSE_SPRING));
    backdropProgress.value = withDelay(STAGGER_MS, withSpring(0, CLOSE_SPRING));
    iconProgress.value     = withSpring(0, ICON_SPRING);
  }, [backdropProgress, iconProgress, pill0, pill1]);

  const toggleMenu = useCallback(() => {
    if (isMenuOpen) closeMenu();
    else openMenu();
  }, [isMenuOpen, openMenu, closeMenu]);

  // ── Animated styles — pure UI thread, no JS calls ──

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      backdropProgress.value,
      [0, 1],
      [0, 0.58],
      Extrapolation.CLAMP
    ),
  }));

  // + rotates 45° → becomes ×
  const fabIconStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(
          iconProgress.value,
          [0, 1],
          [0, 45],
          Extrapolation.CLAMP
        )}deg`,
      },
    ],
  }));

  return (
    <>
      {/* Backdrop */}
      <Animated.View
        style={[styles.backdrop, backdropStyle]}
        pointerEvents={isMenuOpen ? "auto" : "none"}
      >
        <Pressable style={styles.backdropPressable} onPress={toggleMenu} />
      </Animated.View>

      {/* FAB Container */}
      <View
        style={[
          styles.fabArea,
          bottomOffset !== undefined ? { bottom: bottomOffset } : undefined,
          style,
        ]}
        pointerEvents="box-none"
      >
        {/* Pill options */}
        {FAB_OPTIONS.map((option, index) => (
          <OptionPill
            key={option.id}
            option={option}
            styles={styles}
            colors={colors}
            fontFamily={fontFamily}
            isDark={isDark}
            isAestheticTheme={isAestheticTheme}
            pillSV={pillProgress[index]}
            index={index}
            isMenuOpen={isMenuOpen}
            onPress={() => {
              Haptics.light();
              closeMenu();
              if (option.id === "note") {
                onAddNote?.();
              } else {
                onAddTask?.();
              }
            }}
          />
        ))}

        {/* Liquid Glass FAB button */}
        <Pressable
          onPress={toggleMenu}
          hitSlop={spacing.sm}
          style={({ pressed }) => [
            styles.fab,
            { borderColor },
            pressed && styles.fabPressed,
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

          {/* 3. Liquid Glass Specular Gradient Sheen */}
          <LinearGradient
            colors={sheenColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />

          {/* 4. Icon Content */}
          <View style={styles.fabContent}>
            <Animated.View style={fabIconStyle}>
              <Ionicons name="add" size={scale(24)} color={colors.text} />
            </Animated.View>
          </View>
        </Pressable>
      </View>
    </>
  );
});

// ─── Option Pill ─────────────────────────────────────────────────────────────

type OptionPillProps = {
  option: FABOption;
  styles: ReturnType<typeof createStyles>;
  colors: ThemeColors;
  fontFamily: ThemeFontFamily;
  isDark: boolean;
  isAestheticTheme: boolean;
  pillSV: SharedValue<number>;
  index: number;
  isMenuOpen: boolean;
  onPress: () => void;
};

const OptionPill = React.memo(function OptionPill({
  option,
  styles,
  colors,
  fontFamily,
  isDark,
  isAestheticTheme,
  pillSV,
  index,
  isMenuOpen,
  onPress,
}: OptionPillProps) {
  // Pre-computed bottom offset — safe, not inside worklet
  const bottomOffset = FAB_SIZE + spacing.sm + index * (PILL_HEIGHT + PILL_GAP);

  const glassBaseBg =
    Platform.OS === "android"
      ? isDark
        ? "rgba(30, 30, 34, 0.78)"
        : isAestheticTheme
        ? "rgba(255, 255, 255, 0.75)"
        : "rgba(255, 255, 255, 0.8)"
      : isDark
      ? "rgba(28, 28, 30, 0.45)"
      : isAestheticTheme
      ? "rgba(255, 255, 255, 0.45)"
      : "rgba(255, 255, 255, 0.45)";

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

  // Pure worklet: only reads pillSV.value + module-level constants
  const animatedStyle = useAnimatedStyle(() => {
    const p = pillSV.value;
    return {
      opacity: p,
      transform: [
        {
          translateY: interpolate(
            p,
            [0, 1],
            [PILL_OFFSET_Y, 0],
            Extrapolation.CLAMP
          ),
        },
        {
          scale: interpolate(p, [0, 1], [0.85, 1], Extrapolation.CLAMP),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[styles.pillWrapper, { bottom: bottomOffset }, animatedStyle]}
      pointerEvents={isMenuOpen ? "auto" : "none"}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.pill, pressed && styles.pillPressed]}
      >
        {/* 1. Base Glass Underlay */}
        <View style={[styles.glassBase, { backgroundColor: glassBaseBg }]} />

        {/* 2. BlurView (iOS only) */}
        {Platform.OS === "ios" && (
          <BlurView
            intensity={isDark ? 60 : 80}
            tint={isDark ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />
        )}

        {/* 3. Specular Gradient Sheen */}
        <LinearGradient
          colors={sheenColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />

        {/* 4. Pill Content (Circular Icon Badge + Refined Label) */}
        <View style={styles.pillContent}>
          <View style={styles.pillIconBadge}>
            <Ionicons
              name={option.icon}
              size={scale(16)}
              color="#FFFFFF"
            />
          </View>
          <Text style={[styles.pillLabel, { fontFamily: fontFamily.semiBold }]}>
            {option.label}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
});

export default FAB;

// ─── Styles ──────────────────────────────────────────────────────────────────

const createStyles = (
  colors: ThemeColors,
  fontFamily: ThemeFontFamily,
  isDark: boolean,
  isAestheticTheme: boolean
) =>
  StyleSheet.create({
    backdrop: {
      ...StyleSheet.absoluteFill as any,
      backgroundColor: "#000000",
      zIndex: 90,
    },
    backdropPressable: {
      flex: 1,
    },
    fabArea: {
      position: "absolute",
      right: spacing.screenPadding,
      alignItems: "flex-end",
      zIndex: 100,
    },
    fab: {
      width: FAB_SIZE,
      height: FAB_SIZE,
      borderRadius: FAB_SIZE / 2,
      overflow: "hidden",
      borderWidth: 1,
      position: "relative",
      backgroundColor: "transparent",
      ...Platform.select({
        ios: {
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: verticalScale(4) },
          shadowOpacity: 0.22,
          shadowRadius: scale(8),
        },
        android: {
          elevation: 0,
        },
        web: {
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: verticalScale(4) },
          shadowOpacity: 0.22,
          shadowRadius: scale(8),
        },
      }),
    },
    fabContent: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1,
    },
    fabPressed: {
      opacity: 0.72,
      transform: [{ scale: 0.94 }],
    },
    glassBase: {
      ...StyleSheet.absoluteFill as any,
    },
    pillWrapper: {
      position: "absolute",
      right: 0,
      alignItems: "flex-end",
    },
    pill: {
      width: PILL_WIDTH,
      height: PILL_HEIGHT,
      borderRadius: PILL_HEIGHT / 2,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: isDark
        ? "rgba(255, 255, 255, 0.2)"
        : isAestheticTheme
        ? "rgba(255, 255, 255, 0.9)"
        : "rgba(255, 255, 255, 0.85)",
      position: "relative",
      backgroundColor: "transparent",
      ...Platform.select({
        ios: {
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: verticalScale(3) },
          shadowOpacity: isDark ? 0.35 : 0.14,
          shadowRadius: scale(6),
        },
        android: {
          elevation: 0,
        },
        web: {
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: verticalScale(3) },
          shadowOpacity: isDark ? 0.35 : 0.14,
          shadowRadius: scale(6),
        },
      }),
    },
    pillContent: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: scale(13),
      gap: scale(10),
      zIndex: 1,
    },
    pillIconBadge: {
      width: scale(28),
      height: scale(28),
      borderRadius: scale(14),
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary,
    },
    pillPressed: {
      opacity: 0.8,
      transform: [{ scale: 0.96 }],
    },
    pillLabel: {
      fontSize: fontSize.bodyLg,
      color: colors.text,
      letterSpacing: 0.2,
    },
  });
