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
import { scale, verticalScale } from "@/helpers/responsive.utils";
import Svg, {
  Circle,
  Defs,
  G,
  Path,
  Stop,
  RadialGradient as SvgRadialGradient,
} from "react-native-svg";

interface ButterDecorationProps {
  color?: string;
}

// ─── SVG Golden Sun ──────────────────────────────────────────────────────────
function SunMotif({
  size = scale(180),
  color = "#FAD02C",
}: {
  size?: number;
  color?: string;
}) {
  // Alternating long/short rays: 6 long + 6 short = 12 total
  const rays = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
  const cx = 90;
  const cy = 90;
  const r = 90;

  return (
    <Svg width={size} height={size} viewBox="0 0 180 180" fill="none">
      <Defs>
        <SvgRadialGradient id="sunCore" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#FFF9C4" stopOpacity={0.85} />
          <Stop offset="60%" stopColor={color} stopOpacity={0.65} />
          <Stop offset="100%" stopColor="#FACC15" stopOpacity={0.35} />
        </SvgRadialGradient>
      </Defs>

      {/* Rays */}
      <G transform={`translate(${cx}, ${cy})`}>
        {rays.map((angle, idx) => {
          const long = idx % 2 === 0;
          const inner = r * 0.48;
          const outer = long ? r * 0.76 : r * 0.62;
          const tipW = long ? 4 : 3;
          return (
            <Path
              key={angle}
              d={`M ${-tipW} ${-inner} L 0 ${-outer} L ${tipW} ${-inner} Z`}
              fill={color}
              fillOpacity={long ? 0.55 : 0.35}
              transform={`rotate(${angle})`}
            />
          );
        })}
      </G>

      {/* Outer halo ring */}
      <Circle
        cx={cx}
        cy={cy}
        r={r * 0.44}
        stroke={color}
        strokeWidth={1.2}
        strokeOpacity={0.25}
      />

      {/* Core disc */}
      <Circle cx={cx} cy={cy} r={r * 0.4} fill="url(#sunCore)" />

      {/* Inner shimmer */}
      <Circle
        cx={cx}
        cy={cy}
        r={r * 0.28}
        stroke="#FFFFFF"
        strokeWidth={1.2}
        strokeOpacity={0.35}
        strokeDasharray="4 4"
      />
    </Svg>
  );
}

// ─── SVG 4-point Sparkle ─────────────────────────────────────────────────────
function Sparkle({
  size = scale(20),
  color = "#FAD02C",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 0 C12 11, 13 12, 24 12 C13 12, 12 13, 12 24 C12 13, 11 12, 0 12 C11 12, 12 11, 12 0 Z"
        fill={color}
        fillOpacity={0.55}
      />
    </Svg>
  );
}

export function ButterDecoration({
  color = "#FAD02C",
}: ButterDecorationProps) {
  // ── Shared values ───────────────────────────────────────────────────────
  const sunScale = useSharedValue(1);
  const sunRotate = useSharedValue(0); // degrees, numeric
  const sp1Opacity = useSharedValue(0.3);
  const sp1Scale = useSharedValue(0.8);
  const sp2Opacity = useSharedValue(0.7);
  const sp2Scale = useSharedValue(1);
  const sp3Opacity = useSharedValue(0.5);

  useEffect(() => {
    // Sun — very slow breath
    sunScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 4500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.97, { duration: 4500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );

    // Sun — extremely slow rotation
    sunRotate.value = withRepeat(
      withTiming(360, { duration: 60000, easing: Easing.linear }),
      -1,
      false,
    );

    // Sparkle 1 twinkle
    sp1Opacity.value = withRepeat(
      withSequence(
        withTiming(0.75, { duration: 3200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.15, { duration: 3200, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
    sp1Scale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 3200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.75, { duration: 3200, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );

    // Sparkle 2
    sp2Opacity.value = withRepeat(
      withSequence(
        withTiming(0.2, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.8, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
    sp2Scale.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );

    // Sparkle 3
    sp3Opacity.value = withRepeat(
      withSequence(
        withTiming(0.75, { duration: 5000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.15, { duration: 5000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );

    return () => {
      cancelAnimation(sunScale);
      cancelAnimation(sunRotate);
      cancelAnimation(sp1Opacity);
      cancelAnimation(sp1Scale);
      cancelAnimation(sp2Opacity);
      cancelAnimation(sp2Scale);
      cancelAnimation(sp3Opacity);
    };
  }, []);

  // ── Animated styles ─────────────────────────────────────────────────────
  const styleSun = useAnimatedStyle(() => ({
    transform: [{ scale: sunScale.value }, { rotate: `${sunRotate.value}deg` }],
  }));

  const styleSparkle1 = useAnimatedStyle(() => ({
    opacity: sp1Opacity.value,
    transform: [{ scale: sp1Scale.value }],
  }));

  const styleSparkle2 = useAnimatedStyle(() => ({
    opacity: sp2Opacity.value,
    transform: [{ scale: sp2Scale.value }],
  }));

  const styleSparkle3 = useAnimatedStyle(() => ({
    opacity: sp3Opacity.value,
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* ── Solar flare gradient from top-right ─────────────────────────── */}
      <LinearGradient
        colors={[
          "rgba(254,240,138,0.18)",
          "rgba(254,249,195,0.06)",
          "rgba(255,254,247,0)",
        ]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0.1, y: 0.65 }}
        style={styles.solarFlareGlow}
      />

      {/* ── Warm ambient base ────────────────────────────────────────────── */}
      <LinearGradient
        colors={["rgba(254,240,138,0.10)", "rgba(255,254,247,0)"]}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0.6 }}
        style={styles.warmBaseGlow}
      />

      {/* ── Sun — positioned at top-right ───────────────────────────────── */}
      <Animated.View style={[styles.sunWrap, styleSun]}>
        <SunMotif size={scale(180)} color={color} />
      </Animated.View>

      {/* ── Sparkle cluster near sun edge ──────────────────────────────── */}
      <Animated.View style={[styles.sparkle1, styleSparkle1]}>
        <Sparkle size={scale(22)} color={color} />
      </Animated.View>

      <Animated.View style={[styles.sparkle2, styleSparkle2]}>
        <Sparkle size={scale(16)} color="#FACC15" />
      </Animated.View>

      <Animated.View style={[styles.sparkle3, styleSparkle3]}>
        <Sparkle size={scale(18)} color={color} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  solarFlareGlow: {
    position: "absolute",
    top: 0,
    right: 0,
    width: scale(320),
    height: scale(320),
    borderRadius: scale(160),
  },
  warmBaseGlow: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: verticalScale(200),
  },

  // Sun: top-right corner
  sunWrap: {
    position: "absolute",
    top: -verticalScale(45),
    right: -scale(45),
    opacity: 0.38,
  },

  // Sparkles: clustered around the visible sun arc
  sparkle1: {
    position: "absolute",
    top: verticalScale(110),
    right: scale(32),
  },
  sparkle2: {
    position: "absolute",
    top: verticalScale(70),
    right: scale(80),
  },
  sparkle3: {
    position: "absolute",
    top: verticalScale(140),
    right: scale(65),
  },
});
