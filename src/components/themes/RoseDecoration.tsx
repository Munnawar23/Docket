import { hp, scale, wp } from "@/helpers/responsiveHelper";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";
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
  color = "#E11D74",
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
          <Stop offset="0%" stopColor={color} stopOpacity={0.92} />
          <Stop offset="100%" stopColor={color} stopOpacity={0.50} />
        </SvgLinearGradient>
      </Defs>

      {/* Leaves */}
      <Path
        d="M22 72 C8 62, 6 44, 22 38 C32 48, 30 66, 22 72 Z"
        fill="#10B981"
        fillOpacity={0.65}
        stroke="#059669"
        strokeWidth={1}
        strokeOpacity={0.55}
      />
      <Path
        d="M78 72 C92 62, 94 44, 78 38 C68 48, 70 66, 78 72 Z"
        fill="#10B981"
        fillOpacity={0.65}
        stroke="#059669"
        strokeWidth={1}
        strokeOpacity={0.55}
      />

      {/* Outer Petals */}
      <Path
        d="M50 18 C24 18, 14 44, 30 68 C44 84, 56 84, 70 68 C86 44, 76 18, 50 18 Z"
        fill={`url(#${gradId})`}
        stroke={color}
        strokeWidth={1.8}
        strokeOpacity={0.7}
      />

      {/* Spiral petal lines */}
      <Path
        d="M38 42 C34 56, 44 74, 60 70 C72 67, 74 50, 63 42
           C51 32, 40 47, 47 60 C50 66, 59 65, 61 57
           C63 51, 57 47, 53 50"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
        strokeOpacity={0.85}
      />

      {/* Centre */}
      <Circle cx="50" cy="50" r="5" fill={color} fillOpacity={0.8} />
      <Circle cx="50" cy="50" r="2.5" fill="#fff" fillOpacity={0.5} />
    </Svg>
  );
}

// ─── SVG Petal ───────────────────────────────────────────────────────────────
function Petal({
  size = scale(26),
  color = "#E11D74",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Path
        d="M20 4 C33 9, 37 28, 20 36 C3 28, 7 9, 20 4 Z"
        fill={color}
        fillOpacity={0.50}
        stroke={color}
        strokeWidth={1.1}
        strokeOpacity={0.72}
      />
      {/* Center delicate vein */}
      <Path
        d="M20 7 L20 33"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth={0.8}
      />
    </Svg>
  );
}

// ─── SVG Romantic Stardust / Sparkle ─────────────────────────────────────────
function RoseSparkle({
  size = scale(13),
  color = "#9D174D",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 0 C12 10, 14 12, 24 12 C14 12, 12 14, 12 24 C12 14, 10 12, 0 12 C10 12, 12 10, 12 0 Z"
        fill={color}
        fillOpacity={0.85}
      />
      <Circle cx="12" cy="12" r="1.8" fill="#FFFFFF" fillOpacity={0.9} />
    </Svg>
  );
}

export function RoseDecoration({ color = "#E11D74" }: RoseDecorationProps) {
  const accentColor = "#BE185D";
  const sparkleColor = "#9D174D";

  return (
    <View style={styles.container} pointerEvents="none">
      {/* ── Top-right blush aura ────────────────────────────────────────── */}
      <LinearGradient
        colors={["rgba(232,54,133,0.18)", "rgba(232,54,133,0)"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0.2, y: 0.55 }}
        style={styles.auraTopRight}
      />

      {/* ── Bottom-left blush aura ──────────────────────────────────────── */}
      <LinearGradient
        colors={["rgba(232,54,133,0.15)", "rgba(232,54,133,0)"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 0.55, y: 0.45 }}
        style={styles.auraBottomLeft}
      />

      {/* ── Main Corner Rose Anchor ────────────────────────────────────────── */}
      <View style={styles.roseTopRight}>
        <RoseBlossom size={scale(140)} color={color} gradId="rg_tr" />
      </View>

      {/* ── Tastefully Spaced Petals (6 total, across sides & center) ──── */}
      {/* Top right drifting from main rose */}
      <View style={styles.petal1}>
        <Petal size={scale(26)} color={color} />
      </View>

      {/* Upper center */}
      <View style={styles.petal2}>
        <Petal size={scale(20)} color={accentColor} />
      </View>

      {/* Mid left */}
      <View style={styles.petal3}>
        <Petal size={scale(24)} color={color} />
      </View>

      {/* Mid-lower center */}
      <View style={styles.petal4}>
        <Petal size={scale(21)} color={accentColor} />
      </View>

      {/* Bottom left drifting from bottom rose */}
      <View style={styles.petal5}>
        <Petal size={scale(25)} color={color} />
      </View>

      {/* Bottom right subtle accent */}
      <View style={styles.petal6}>
        <Petal size={scale(19)} color={accentColor} />
      </View>

      {/* ── Delicate Stardust Sparkles (4 total) ────────────────────────── */}
      <View style={styles.sparkle1}>
        <RoseSparkle size={scale(13)} color={sparkleColor} />
      </View>
      <View style={styles.sparkle2}>
        <RoseSparkle size={scale(11)} color={sparkleColor} />
      </View>
      <View style={styles.sparkle3}>
        <RoseSparkle size={scale(14)} color={sparkleColor} />
      </View>
      <View style={styles.sparkle4}>
        <RoseSparkle size={scale(10)} color={sparkleColor} />
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

  // ── Gradient Auras ─────────────────────────────────────────────────────────
  auraTopRight: {
    position: "absolute",
    top: -hp(4),
    right: -wp(6),
    width: wp(72),
    height: wp(72),
    borderRadius: wp(36),
  },
  auraBottomLeft: {
    position: "absolute",
    bottom: -hp(20),
    left: -wp(15),
    width: wp(80),
    height: wp(80),
    borderRadius: wp(40),
  },

  // ── Rose Blossom Anchors ───────────────────────────────────────────────────
  roseTopRight: {
    position: "absolute",
    top: -hp(1.2),
    right: -wp(8.5),
    opacity: 0.38,
    transform: [{ rotate: "12deg" }],
  },

  // ── Balanced Petal Positions (6 petals total) ──────────────────────────────
  petal1: {
    position: "absolute",
    top: hp(14),
    right: wp(12),
    opacity: 0.65,
    transform: [{ rotate: "18deg" }],
  },
  petal2: {
    position: "absolute",
    top: hp(28),
    left: wp(45),
    opacity: 0.48,
    transform: [{ rotate: "-15deg" }],
  },
  petal3: {
    position: "absolute",
    top: hp(46),
    left: wp(7),
    opacity: 0.60,
    transform: [{ rotate: "24deg" }],
  },
  petal4: {
    position: "absolute",
    top: hp(62),
    left: wp(52),
    opacity: 0.46,
    transform: [{ rotate: "-20deg" }],
  },
  petal5: {
    position: "absolute",
    bottom: hp(22),
    left: wp(15),
    opacity: 0.58,
    transform: [{ rotate: "32deg" }],
  },
  petal6: {
    position: "absolute",
    bottom: hp(16),
    right: wp(14),
    opacity: 0.50,
    transform: [{ rotate: "-28deg" }],
  },

  // ── Subtle Romantic Sparkles (4 sparkles total) ────────────────────────────
  sparkle1: {
    position: "absolute",
    top: hp(10),
    right: wp(26),
    opacity: 0.70,
  },
  sparkle2: {
    position: "absolute",
    top: hp(38),
    left: wp(35),
    opacity: 0.55,
  },
  sparkle3: {
    position: "absolute",
    top: hp(54),
    right: wp(16),
    opacity: 0.65,
  },
  sparkle4: {
    position: "absolute",
    bottom: hp(28),
    right: wp(32),
    opacity: 0.55,
  },
});
