import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { scale, verticalScale } from "react-native-size-matters";
import Svg, { Path } from "react-native-svg";

interface SkyDecorationProps {
  color?: string;
}

// ─── Fluffy Cloud (single path, scalable) ─────────────────────────────────────
function Cloud({
  width = scale(160),
  height = verticalScale(88),
  color = "#38BDF8",
}: {
  width?: number;
  height?: number;
  color?: string;
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 160 88" fill="none">
      {/* Large base cloud body */}
      <Path
        d="M30 72
           C14 72,  4 58, 10 42
           C15 28, 34 24, 44 33
           C52 14, 88 12, 100 30
           C110 18, 136 24, 140 42
           C145 58, 134 72, 120 72
           Z"
        fill={color}
        fillOpacity={0.22}
        stroke={color}
        strokeWidth={1.2}
        strokeOpacity={0.3}
      />
      {/* Puff bumps on top */}
      <Path
        d="M60 33 C60 22, 78 20, 80 30"
        stroke={color}
        strokeWidth={8}
        strokeLinecap="round"
        strokeOpacity={0.12}
        fill="none"
      />
    </Svg>
  );
}

// ─── Thin breeze wave line ─────────────────────────────────────────────────────
function Breeze({
  width = scale(52),
  height = verticalScale(16),
  color = "#38BDF8",
}: {
  width?: number;
  height?: number;
  color?: string;
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 52 16" fill="none">
      <Path
        d="M2 12 C14 4, 22 14, 34 6 C42 0, 50 10, 50 10"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeOpacity={0.4}
        fill="none"
      />
    </Svg>
  );
}

export function SkyDecoration({ color = "#38BDF8" }: SkyDecorationProps) {
  // ── Shared values ───────────────────────────────────────────────────────
  const c1x = useSharedValue(0);
  const c2x = useSharedValue(0);

  useEffect(() => {
    // Cloud 1 — slow peaceful drift
    c1x.value = withRepeat(
      withSequence(
        withTiming(scale(18), {
          duration: 9000,
          easing: Easing.inOut(Easing.sin),
        }),
        withTiming(scale(-12), {
          duration: 9000,
          easing: Easing.inOut(Easing.sin),
        }),
      ),
      -1,
      true,
    );

    // Cloud 2 — slightly different phase & amplitude
    c2x.value = withRepeat(
      withSequence(
        withTiming(scale(-16), {
          duration: 11000,
          easing: Easing.inOut(Easing.sin),
        }),
        withTiming(scale(10), {
          duration: 11000,
          easing: Easing.inOut(Easing.sin),
        }),
      ),
      -1,
      true,
    );

    return () => {
      cancelAnimation(c1x);
      cancelAnimation(c2x);
    };
  }, []);

  const styleCloud1 = useAnimatedStyle(() => ({
    transform: [{ translateX: c1x.value }],
  }));

  const styleCloud2 = useAnimatedStyle(() => ({
    transform: [{ translateX: c2x.value }],
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* ── Atmospheric sky haze at top ────────────────────────────────── */}
      <LinearGradient
        colors={["rgba(56,189,248,0.16)", "rgba(240,248,255,0)"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.45 }}
        style={styles.skyHaze}
      />

      {/* ── Cloud 1 — top-right, large ────────────────────────────────── */}
      <Animated.View style={[styles.cloud1, styleCloud1]}>
        <Cloud width={scale(175)} height={verticalScale(96)} color={color} />
      </Animated.View>

      {/* ── Cloud 2 — mid-left, medium, lower opacity ─────────────────── */}
      <Animated.View style={[styles.cloud2, styleCloud2]}>
        <Cloud width={scale(140)} height={verticalScale(78)} color={color} />
      </Animated.View>

      {/* ── Static breeze accents ─────────────────────────────────────── */}
      <View style={styles.breeze1}>
        <Breeze width={scale(52)} height={verticalScale(16)} color={color} />
      </View>
      <View style={styles.breeze2}>
        <Breeze width={scale(42)} height={verticalScale(14)} color={color} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skyHaze: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: verticalScale(240),
  },

  // Cloud 1: right side
  cloud1: {
    position: "absolute",
    top: verticalScale(16),
    right: -scale(32),
    opacity: 0.65,
  },

  // Cloud 2: left mid-screen
  cloud2: {
    position: "absolute",
    top: verticalScale(300),
    left: -scale(20),
    opacity: 0.48,
  },

  // Breeze: subtle wind lines
  breeze1: {
    position: "absolute",
    top: verticalScale(100),
    left: scale(32),
    opacity: 0.55,
  },
  breeze2: {
    position: "absolute",
    top: verticalScale(260),
    right: scale(32),
    opacity: 0.45,
  },
});
