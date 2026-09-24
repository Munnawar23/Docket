import { useAppTheme } from "@/hooks/useAppTheme";
import { Haptics } from "@/lib/haptics";
import type { ThemeColors } from "@/theme/colors";
import { fontSize, spacing } from "@/theme/theme";
import type { ThemeFontFamily } from "@/theme/typography";
import { AppText } from "./AppText";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type ViewStyle,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
  type WithSpringConfig,
} from "react-native-reanimated";
import { scale, verticalScale } from "@/helpers/responsive.utils";
import { scheduleOnRN } from "react-native-worklets";

export interface TabOption {
  label: string;
  value: string;
}

export interface TabSwitcherProps {
  tabs: TabOption[];
  activeTab: string;
  onTabChange: (value: string) => void;
  containerStyle?: ViewStyle;
  activeTextColor?: string;
  inactiveTextColor?: string;
  activePillColor?: string;
  activePillBorderColor?: string;
  trackBorderColor?: string;
  glassBaseBg?: string;
  sheenColors?: [string, string, string];
  blurIntensity?: number;
  blurTint?: "light" | "dark";
}

// Bouncier, more springy iOS-like physics
const SPRING_CONFIG: WithSpringConfig = {
  mass: 0.65,
  damping: 17,
  stiffness: 240,
  overshootClamping: false,
};

const SCALE_SPRING_CONFIG: WithSpringConfig = {
  mass: 0.55,
  damping: 14,
  stiffness: 260,
  overshootClamping: false,
};

interface ThemeGlassConfig {
  sheenColors: [string, string, string];
  blurIntensity: number;
  blurTint: "light" | "dark";
  glassBaseBg: string;
}

const getDefaultGlassConfig = (
  isDark: boolean,
  isAestheticTheme: boolean,
): ThemeGlassConfig => {
  const sheenColors: [string, string, string] = isDark
    ? [
        "rgba(255, 255, 255, 0.22)",
        "rgba(58, 58, 60, 0.35)",
        "rgba(28, 28, 30, 0.5)",
      ]
    : isAestheticTheme
      ? [
          "rgba(255, 255, 255, 0.9)",
          "rgba(255, 255, 255, 0.45)",
          "rgba(255, 255, 255, 0.15)",
        ]
      : [
          "rgba(255, 255, 255, 0.85)",
          "rgba(255, 255, 255, 0.35)",
          "rgba(230, 230, 238, 0.3)",
        ];

  const blurIntensity = isDark ? 60 : isAestheticTheme ? 80 : 75;
  const blurTint: "light" | "dark" = isDark ? "dark" : "light";

  const glassBaseBg =
    Platform.OS === "android"
      ? isDark
        ? "rgba(30, 30, 34, 0.72)"
        : isAestheticTheme
          ? "rgba(255, 255, 255, 0.65)"
          : "rgba(255, 255, 255, 0.65)"
      : isDark
        ? "rgba(28, 28, 30, 0.4)"
        : isAestheticTheme
          ? "rgba(255, 255, 255, 0.4)"
          : "rgba(255, 255, 255, 0.4)";

  return { sheenColors, blurIntensity, blurTint, glassBaseBg };
};

export const TabSwitcher = React.memo<TabSwitcherProps>(function TabSwitcher({
  tabs,
  activeTab,
  onTabChange,
  containerStyle,
  activeTextColor,
  inactiveTextColor,
  activePillColor,
  activePillBorderColor,
  trackBorderColor,
  glassBaseBg: customGlassBaseBg,
  sheenColors: customSheenColors,
  blurIntensity: customBlurIntensity,
  blurTint: customBlurTint,
}) {
  const { colors, fontFamily, isDark, isAestheticTheme } = useAppTheme();
  const styles = useMemo(
    () =>
      createStyles({
        colors,
        fontFamily,
        isDark,
        isAestheticTheme,
        activeTextColor,
        inactiveTextColor,
        activePillColor,
        activePillBorderColor,
        trackBorderColor,
      }),
    [
      colors,
      fontFamily,
      isDark,
      isAestheticTheme,
      activeTextColor,
      inactiveTextColor,
      activePillColor,
      activePillBorderColor,
      trackBorderColor,
    ],
  );
  const [containerWidth, setContainerWidth] = useState(0);

  const defaultGlass = useMemo(
    () => getDefaultGlassConfig(isDark, isAestheticTheme),
    [isDark, isAestheticTheme],
  );

  const sheenColors = customSheenColors ?? defaultGlass.sheenColors;
  const blurIntensity = customBlurIntensity ?? defaultGlass.blurIntensity;
  const blurTint = customBlurTint ?? defaultGlass.blurTint;
  const glassBaseBg = customGlassBaseBg ?? defaultGlass.glassBaseBg;

  const activeIndex = Math.max(
    tabs.findIndex((t) => t.value === activeTab),
    0,
  );
  const tabWidth =
    containerWidth > 0 ? (containerWidth - spacing.xs * 2) / tabs.length : 0;

  const translateX = useSharedValue(0);
  const pillScale = useSharedValue(1);
  const startX = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (tabWidth > 0 && !isDragging.value) {
      if (isFirstMount.current) {
        isFirstMount.current = false;
        translateX.value = activeIndex * tabWidth;
        return;
      }
      // Fluid zoom surge during transit, then springs back to 1.0
      pillScale.value = withSequence(
        withTiming(1.45, {
          duration: 140,
          easing: Easing.out(Easing.quad),
        }),
        withSpring(1.0, SCALE_SPRING_CONFIG),
      );
      translateX.value = withSpring(activeIndex * tabWidth, SPRING_CONFIG);
    }
  }, [activeIndex, tabWidth]);

  const handleTabChange = useCallback(
    (val: string) => {
      Haptics.light();
      onTabChange(val);
    },
    [onTabChange],
  );

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      "worklet";
      isDragging.value = true;
      startX.value = translateX.value;
      // Fluid zoom while dragging
      pillScale.value = withSpring(1.45, SCALE_SPRING_CONFIG);
    })
    .onUpdate((event) => {
      "worklet";
      if (tabWidth <= 0) return;
      const maxTranslate = tabWidth * (tabs.length - 1);
      const rawX = startX.value + event.translationX;
      // Allow elastic rubberband movement outside the left/right tab boundaries
      if (rawX < 0) {
        translateX.value = rawX * 0.45;
      } else if (rawX > maxTranslate) {
        translateX.value = maxTranslate + (rawX - maxTranslate) * 0.45;
      } else {
        translateX.value = rawX;
      }
    })
    .onFinalize(() => {
      "worklet";
      isDragging.value = false;
      // Snap back to normal scale with bouncy spring
      pillScale.value = withSpring(1.0, SCALE_SPRING_CONFIG);
      if (tabWidth <= 0) return;
      const closestIndex = Math.round(translateX.value / tabWidth);
      const boundedIndex = Math.max(0, Math.min(closestIndex, tabs.length - 1));
      translateX.value = withSpring(boundedIndex * tabWidth, SPRING_CONFIG);
      const selectedTab = tabs[boundedIndex];
      if (selectedTab && selectedTab.value !== activeTab) {
        scheduleOnRN(handleTabChange, selectedTab.value);
      }
    });

  const animatedPillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { scale: pillScale.value }],
    width: tabWidth > 0 ? tabWidth : 0,
  }));

  const onLayoutContainer = useCallback((e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  }, []);

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.track}>
        {/* Track Glass Background (clipped cleanly to pill shape) */}
        <View style={styles.trackBackground}>
          {/* 1. Base Glass Underlay */}
          <View style={[styles.glassBase, { backgroundColor: glassBaseBg }]} />

          {/* 2. BlurView (iOS only) */}
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
        </View>

        <GestureDetector gesture={panGesture}>
          <View style={styles.tabContainer} onLayout={onLayoutContainer}>
            {/* Animated Active Pill Indicator (allowed to zoom and pop OUTSIDE the track without clipping!) */}
            {tabWidth > 0 && (
              <Animated.View
                pointerEvents="none"
                style={[styles.activePill, animatedPillStyle]}
              />
            )}

            {/* Tab Items */}
            {tabs.map((tab) => {
              const isActive = activeTab === tab.value;
              return (
                <Pressable
                  key={tab.value}
                  style={styles.tab}
                  hitSlop={spacing.xs}
                  onPress={() => {
                    if (!isActive) {
                      handleTabChange(tab.value);
                    }
                  }}
                >
                  <AppText
                    style={[
                      styles.tabText,
                      isActive ? styles.tabTextActive : styles.tabTextInactive,
                    ]}
                    numberOfLines={1}
                  >
                    {tab.label}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </GestureDetector>
      </View>
    </View>
  );
});

export default TabSwitcher;

interface StyleConfig {
  colors: ThemeColors;
  fontFamily: ThemeFontFamily;
  isDark: boolean;
  isAestheticTheme: boolean;
  activeTextColor?: string;
  inactiveTextColor?: string;
  activePillColor?: string;
  activePillBorderColor?: string;
  trackBorderColor?: string;
}

const createStyles = ({
  colors,
  fontFamily,
  isDark,
  isAestheticTheme,
  activeTextColor,
  inactiveTextColor,
  activePillColor,
  activePillBorderColor,
  trackBorderColor,
}: StyleConfig) =>
  StyleSheet.create({
    container: {
      width: scale(190),
      alignSelf: "center",
      overflow: "visible",
    },
    track: {
      width: "100%",
      position: "relative",
      overflow: "visible",
    },
    trackBackground: {
      ...(StyleSheet.absoluteFill as any),
      borderRadius: spacing.xxl,
      overflow: "hidden",
      borderWidth: 1,
      borderColor:
        trackBorderColor ??
        (isDark
          ? "rgba(255, 255, 255, 0.2)"
          : isAestheticTheme
            ? "rgba(255, 255, 255, 0.9)"
            : "rgba(255, 255, 255, 0.85)"),
    },
    glassBase: {
      ...(StyleSheet.absoluteFill as any),
    },
    tabContainer: {
      flexDirection: "row",
      padding: spacing.xs,
      position: "relative",
      overflow: "visible",
      zIndex: 1,
    },
    activePill: {
      position: "absolute",
      top: spacing.xs,
      bottom: spacing.xs,
      left: spacing.xs,
      borderRadius: spacing.xl,
      backgroundColor:
        activePillColor ?? (isDark ? "rgba(58, 58, 60, 0.9)" : colors.card),
      borderWidth: 1,
      borderColor:
        activePillBorderColor ??
        (isDark
          ? "rgba(255, 255, 255, 0.22)"
          : "rgba(255, 255, 255, 0.95)"),
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: verticalScale(3) },
      shadowOpacity: isDark ? 0.35 : 0.16,
      shadowRadius: scale(6),
      elevation: 4,
      zIndex: 1,
    },
    tab: {
      flex: 1,
      paddingVertical: spacing.vSm,
      paddingHorizontal: spacing.sm,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10,
    },
    tabText: {
      textAlign: "center",
      fontSize: fontSize.body,
    },
    tabTextActive: {
      fontFamily: fontFamily.bold,
      color: activeTextColor ?? colors.primary,
    },
    tabTextInactive: {
      fontFamily: fontFamily.medium,
      color: inactiveTextColor ?? colors.subtext,
    },
  });
