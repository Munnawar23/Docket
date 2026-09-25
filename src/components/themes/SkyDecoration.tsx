import { hp, scale, verticalScale, wp } from "@/helpers/responsiveHelper";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

interface SkyDecorationProps {
  color?: string;
}

// ─── Fluffy Cloud (large) ────────────────────────────────────────────────────
function Cloud({
  width = scale(160),
  height = verticalScale(88),
  color = "#0284C7",
}: {
  width?: number;
  height?: number;
  color?: string;
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 160 88" fill="none">
      <Path
        d="M30 72
           C14 72,  4 58, 10 42
           C15 28, 34 24, 44 33
           C52 14, 88 12, 100 30
           C110 18, 136 24, 140 42
           C145 58, 134 72, 120 72
           Z"
        fill={color}
        fillOpacity={0.34}
        stroke={color}
        strokeWidth={1.4}
        strokeOpacity={0.48}
      />
      <Path
        d="M60 33 C60 22, 78 20, 80 30"
        stroke={color}
        strokeWidth={7}
        strokeLinecap="round"
        strokeOpacity={0.16}
        fill="none"
      />
    </Svg>
  );
}

// ─── Small Cloud Puff ────────────────────────────────────────────────────────
function CloudPuff({
  width = scale(95),
  height = verticalScale(52),
  color = "#0284C7",
}: {
  width?: number;
  height?: number;
  color?: string;
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 90 50" fill="none">
      <Path
        d="M18 42 C8 42, 2 34, 6 25 C9 16, 20 14, 26 20 C31 8, 52 7, 59 18 C65 11, 80 14, 82 25 C85 34, 78 42, 70 42 Z"
        fill={color}
        fillOpacity={0.30}
        stroke={color}
        strokeWidth={1.2}
        strokeOpacity={0.42}
      />
    </Svg>
  );
}

// ─── Distant Soaring Bird ────────────────────────────────────────────────────
function Bird({
  size = scale(18),
  color = "#0284C7",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size * 0.55} viewBox="0 0 24 13" fill="none">
      <Path
        d="M1 10 C5 3, 9 2, 12 7 C15 2, 19 3, 23 10 C18 6, 15 8, 12 12 C9 8, 6 6, 1 10 Z"
        fill={color}
        fillOpacity={0.65}
      />
    </Svg>
  );
}

// ─── Sky Sunlight Glint / Sparkle ────────────────────────────────────────────
function SkyGlint({
  size = scale(13),
  color = "#0284C7",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 0 C12 9, 15 12, 24 12 C15 12, 12 15, 12 24 C12 15, 9 12, 0 12 C9 12, 12 9, 12 0 Z"
        fill={color}
        fillOpacity={0.72}
      />
      <Circle cx="12" cy="12" r="1.8" fill="#FFFFFF" fillOpacity={0.9} />
    </Svg>
  );
}

// ─── Thin Breeze Wave Line ───────────────────────────────────────────────────
function Breeze({
  width = scale(52),
  height = verticalScale(16),
  color = "#0284C7",
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
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeOpacity={0.50}
        fill="none"
      />
    </Svg>
  );
}

export function SkyDecoration({ color = "#0284C7" }: SkyDecorationProps) {
  const glintColor = "#0284C7";

  return (
    <View style={styles.container} pointerEvents="none">
      {/* ── Atmospheric sky haze at top ────────────────────────────────── */}
      <LinearGradient
        colors={["rgba(2,132,199,0.18)", "rgba(2,132,199,0)"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.45 }}
        style={styles.skyHazeTop}
      />

      {/* ── Soft atmospheric ambient haze at bottom ─────────────────────── */}
      <LinearGradient
        colors={["rgba(2,132,199,0)", "rgba(2,132,199,0.12)"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.skyHazeBottom}
      />

      {/* ── Clouds ─────────────────────────────────────────────────────── */}
      {/* Cloud 1 — top-right, large */}
      <View style={styles.cloud1}>
        <Cloud width={scale(175)} height={verticalScale(96)} color={color} />
      </View>

      {/* Cloud 2 — mid-left, medium */}
      <View style={styles.cloud2}>
        <Cloud width={scale(140)} height={verticalScale(78)} color={color} />
      </View>

      {/* Cloud 3 — lower-right subtle puff */}
      <View style={styles.cloud3}>
        <CloudPuff width={scale(95)} height={verticalScale(52)} color={color} />
      </View>

      {/* ── Soaring Birds in Distance ──────────────────────────────────── */}
      <View style={styles.bird1}>
        <Bird size={scale(19)} color={color} />
      </View>
      <View style={styles.bird2}>
        <Bird size={scale(14)} color={color} />
      </View>
      <View style={styles.bird3}>
        <Bird size={scale(16)} color={color} />
      </View>

      {/* ── Wind Breeze Lines ──────────────────────────────────────────── */}
      <View style={styles.breeze1}>
        <Breeze width={scale(52)} height={verticalScale(16)} color={color} />
      </View>
      <View style={styles.breeze2}>
        <Breeze width={scale(44)} height={verticalScale(14)} color={color} />
      </View>
      <View style={styles.breeze3}>
        <Breeze width={scale(48)} height={verticalScale(15)} color={color} />
      </View>

      {/* ── Subtle Sun Glints / Daytime Sparkles ───────────────────────── */}
      <View style={styles.glint1}>
        <SkyGlint size={scale(14)} color={glintColor} />
      </View>
      <View style={styles.glint2}>
        <SkyGlint size={scale(10)} color={glintColor} />
      </View>
      <View style={styles.glint3}>
        <SkyGlint size={scale(13)} color={glintColor} />
      </View>
      <View style={styles.glint4}>
        <SkyGlint size={scale(11)} color={glintColor} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: hp(0),
    left: wp(0),
    right: wp(0),
    bottom: hp(0),
    width: wp(100),
    height: hp(100),
  },

  // ── Atmospheric Gradient Glows ─────────────────────────────────────────────
  skyHazeTop: {
    position: "absolute",
    top: hp(0),
    left: wp(0),
    right: wp(0),
    height: hp(32),
  },
  skyHazeBottom: {
    position: "absolute",
    bottom: hp(0),
    left: wp(0),
    right: wp(0),
    height: hp(22),
  },

  // ── Half Clouds (anchored to edges) ────────────────────────────────────────
  cloud1: {
    position: "absolute",
    top: hp(1.5),
    right: -wp(22),
    opacity: 0.72,
  },
  cloud2: {
    position: "absolute",
    top: hp(38),
    left: -wp(18),
    opacity: 0.58,
  },
  cloud3: {
    position: "absolute",
    bottom: hp(18),
    right: -wp(14),
    opacity: 0.50,
  },

  // ── Distant Birds ──────────────────────────────────────────────────────────
  bird1: {
    position: "absolute",
    top: hp(9),
    left: wp(18),
    opacity: 0.70,
    transform: [{ rotate: "-8deg" }],
  },
  bird2: {
    position: "absolute",
    top: hp(12),
    left: wp(28),
    opacity: 0.60,
    transform: [{ rotate: "-4deg" }],
  },
  bird3: {
    position: "absolute",
    top: hp(54),
    right: wp(22),
    opacity: 0.65,
    transform: [{ rotate: "6deg" }],
  },

  // ── Breeze Lines ───────────────────────────────────────────────────────────
  breeze1: {
    position: "absolute",
    top: hp(16),
    left: wp(8),
    opacity: 0.60,
  },
  breeze2: {
    position: "absolute",
    top: hp(32),
    right: wp(10),
    opacity: 0.52,
  },
  breeze3: {
    position: "absolute",
    top: hp(68),
    left: wp(38),
    opacity: 0.48,
  },

  // ── Sky Sun Glints / Sparkles ──────────────────────────────────────────────
  glint1: {
    position: "absolute",
    top: hp(19),
    right: wp(22),
    opacity: 0.70,
  },
  glint2: {
    position: "absolute",
    top: hp(45),
    left: wp(48),
    opacity: 0.55,
  },
  glint3: {
    position: "absolute",
    bottom: hp(28),
    left: wp(14),
    opacity: 0.62,
  },
  glint4: {
    position: "absolute",
    bottom: hp(12),
    right: wp(28),
    opacity: 0.55,
  },
});
