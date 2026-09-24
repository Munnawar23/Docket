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
import { scale, verticalScale } from "@/helpers/responsiveHelper";
import Svg, {
  Circle,
  Defs,
  Path,
  Stop,
  LinearGradient as SvgLinearGradient,
} from "react-native-svg";

interface RoseDecorationProps {
  color?: string;
}

// ─── SVG Rose Blossom ────────────────────────────────────────────────────────
function RoseBlossom({
  size = scale(120),
  color = "#F43F8E",
  gradId = "rg0",
}: {
  size?: number;
  color?: string;
  gradId?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Defs>
        <SvgLinearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity={0.85} />
          <Stop offset="100%" stopColor={color} stopOpacity={0.35} />
        </SvgLinearGradient>
      </Defs>

      {/* Leaves */}
      <Path
        d="M22 72 C8 62, 6 44, 22 38 C32 48, 30 66, 22 72 Z"
        fill="#6EE7B7"
        fillOpacity={0.45}
      />
      <Path
        d="M78 72 C92 62, 94 44, 78 38 C68 48, 70 66, 78 72 Z"
        fill="#6EE7B7"
        fillOpacity={0.45}
      />

      {/* Outer Petals */}
      <Path
        d="M50 18 C24 18, 14 44, 30 68 C44 84, 56 84, 70 68 C86 44, 76 18, 50 18 Z"
        fill={`url(#${gradId})`}
        stroke={color}
        strokeWidth={1.5}
        strokeOpacity={0.5}
      />

      {/* Spiral petal lines */}
      <Path
        d="M38 42 C34 56, 44 74, 60 70 C72 67, 74 50, 63 42
           C51 32, 40 47, 47 60 C50 66, 59 65, 61 57
           C63 51, 57 47, 53 50"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        fill="none"
        strokeOpacity={0.7}
      />

      {/* Centre */}
      <Circle cx="50" cy="50" r="5" fill={color} fillOpacity={0.65} />
      <Circle cx="50" cy="50" r="2.5" fill="#fff" fillOpacity={0.4} />
    </Svg>
  );
}

// ─── SVG Petal ───────────────────────────────────────────────────────────────
function Petal({
  size = scale(28),
  color = "#F43F8E",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Path
        d="M20 4 C33 9, 37 28, 20 36 C3 28, 7 9, 20 4 Z"
        fill={color}
        fillOpacity={0.32}
        stroke={color}
        strokeWidth={0.8}
        strokeOpacity={0.45}
      />
    </Svg>
  );
}

export function RoseDecoration({ color = "#F43F8E" }: RoseDecorationProps) {
  // ── Shared values (scaled for smooth multi-device display) ───────────────
  const p1y = useSharedValue(0);
  const p1r = useSharedValue(0);
  const p2y = useSharedValue(0);
  const p2x = useSharedValue(0);
  const p2r = useSharedValue(0);
  const p3y = useSharedValue(0);
  const p3r = useSharedValue(0);

  useEffect(() => {
    // Petal 1 — gentle float up/down, slow spin
    p1y.value = withRepeat(
      withSequence(
        withTiming(verticalScale(-14), {
          duration: 5000,
          easing: Easing.inOut(Easing.sin),
        }),
        withTiming(0, {
          duration: 5000,
          easing: Easing.inOut(Easing.sin),
        }),
      ),
      -1,
      true,
    );
    p1r.value = withRepeat(
      withSequence(
        withTiming(18, { duration: 6000, easing: Easing.inOut(Easing.sin) }),
        withTiming(-8, { duration: 6000, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );

    // Petal 2 — cross float
    p2y.value = withRepeat(
      withSequence(
        withTiming(verticalScale(16), {
          duration: 7000,
          easing: Easing.inOut(Easing.sin),
        }),
        withTiming(verticalScale(-6), {
          duration: 7000,
          easing: Easing.inOut(Easing.sin),
        }),
      ),
      -1,
      true,
    );
    p2x.value = withRepeat(
      withSequence(
        withTiming(scale(-12), {
          duration: 8000,
          easing: Easing.inOut(Easing.sin),
        }),
        withTiming(scale(8), {
          duration: 8000,
          easing: Easing.inOut(Easing.sin),
        }),
      ),
      -1,
      true,
    );
    p2r.value = withRepeat(
      withSequence(
        withTiming(30, { duration: 9000, easing: Easing.inOut(Easing.sin) }),
        withTiming(-10, { duration: 9000, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );

    // Petal 3 — slow drift
    p3y.value = withRepeat(
      withSequence(
        withTiming(verticalScale(-10), {
          duration: 6500,
          easing: Easing.inOut(Easing.sin),
        }),
        withTiming(verticalScale(10), {
          duration: 6500,
          easing: Easing.inOut(Easing.sin),
        }),
      ),
      -1,
      true,
    );
    p3r.value = withRepeat(
      withSequence(
        withTiming(50, { duration: 8000, easing: Easing.inOut(Easing.sin) }),
        withTiming(20, { duration: 8000, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );

    // Cleanup on unmount
    return () => {
      cancelAnimation(p1y);
      cancelAnimation(p1r);
      cancelAnimation(p2y);
      cancelAnimation(p2x);
      cancelAnimation(p2r);
      cancelAnimation(p3y);
      cancelAnimation(p3r);
    };
  }, []);

  // ── Animated styles ─────────────────────────────────────────────────────
  const stylePetal1 = useAnimatedStyle(() => ({
    transform: [{ translateY: p1y.value }, { rotate: `${p1r.value}deg` }],
  }));

  const stylePetal2 = useAnimatedStyle(() => ({
    transform: [
      { translateY: p2y.value },
      { translateX: p2x.value },
      { rotate: `${p2r.value}deg` },
    ],
  }));

  const stylePetal3 = useAnimatedStyle(() => ({
    transform: [{ translateY: p3y.value }, { rotate: `${p3r.value}deg` }],
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* ── Top-right blush aura ────────────────────────────────────────── */}
      <LinearGradient
        colors={["rgba(244,63,142,0.18)", "rgba(255,240,245,0)"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0.2, y: 0.55 }}
        style={styles.auraTopRight}
      />

      {/* ── Bottom-left blush aura ──────────────────────────────────────── */}
      <LinearGradient
        colors={["rgba(251,207,232,0.22)", "rgba(255,240,245,0)"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 0.55, y: 0.45 }}
        style={styles.auraBottomLeft}
      />

      {/* ── Roses ──────────────────────────────────────────────────────── */}
      {/* Top-right — clipped nicely at screen edge */}
      <View style={styles.roseTopRight}>
        <RoseBlossom size={scale(140)} color={color} gradId="rg_tr" />
      </View>

      {/* Bottom-left */}
      <View style={styles.roseBottomLeft}>
        <RoseBlossom size={scale(110)} color={color} gradId="rg_bl" />
      </View>

      {/* ── Floating petals ─────────────────────────────────────────────── */}
      <Animated.View style={[styles.petal1, stylePetal1]}>
        <Petal size={scale(30)} color={color} />
      </Animated.View>

      <Animated.View style={[styles.petal2, stylePetal2]}>
        <Petal size={scale(22)} color={color} />
      </Animated.View>

      <Animated.View style={[styles.petal3, stylePetal3]}>
        <Petal size={scale(26)} color={color} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  // ── Gradient auras ─────────────────────────────────────────────────────────
  auraTopRight: {
    position: "absolute",
    top: 0,
    right: 0,
    width: scale(270),
    height: scale(270),
    borderRadius: scale(135),
  },
  auraBottomLeft: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: scale(260),
    height: scale(260),
    borderRadius: scale(130),
  },

  // ── Rose anchors ───────────────────────────────────────────────────────────
  roseTopRight: {
    position: "absolute",
    top: -verticalScale(10),
    right: -scale(32),
    opacity: 0.18,
    transform: [{ rotate: "12deg" }],
  },
  roseBottomLeft: {
    position: "absolute",
    bottom: verticalScale(60),
    left: -scale(20),
    opacity: 0.13,
    transform: [{ rotate: "-20deg" }],
  },

  // ── Petal positions ────────────────────────────────────────────────────────
  petal1: {
    position: "absolute",
    top: verticalScale(130),
    right: scale(32),
    opacity: 0.55,
  },
  petal2: {
    position: "absolute",
    top: verticalScale(320),
    left: scale(20),
    opacity: 0.5,
  },
  petal3: {
    position: "absolute",
    bottom: verticalScale(200),
    right: scale(48),
    opacity: 0.45,
  },
});
