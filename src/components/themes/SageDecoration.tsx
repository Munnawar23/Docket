import { hp, scale, wp } from "@/helpers/responsiveHelper";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  Path,
  Stop,
  LinearGradient as SvgLinearGradient,
} from "react-native-svg";
import { FloatingLeaves } from "@/components";

interface SageDecorationProps {
  color?: string;
}

// ─── SVG Botanical Olive Branch with Olives ──────────────────────────────────
function OliveBranch({
  size = scale(140),
  color = "#557E34",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <Defs>
        <SvgLinearGradient
          id="oliveLeafGrad"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <Stop offset="0%" stopColor="#76A24D" stopOpacity={0.9} />
          <Stop offset="100%" stopColor={color} stopOpacity={0.65} />
        </SvgLinearGradient>
      </Defs>

      {/* Main curved branch stem */}
      <Path
        d="M10 110 C40 85, 75 60, 110 15"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeOpacity={0.6}
      />

      {/* Stylized Olive Berries */}
      <Circle cx="96" cy="38" r="5.5" fill="#3D5A24" fillOpacity={0.75} />
      <Circle cx="94" cy="36" r="1.5" fill="#A1C67E" fillOpacity={0.8} />

      <Circle cx="72" cy="62" r="6" fill="#3D5A24" fillOpacity={0.75} />
      <Circle cx="70" cy="60" r="1.6" fill="#A1C67E" fillOpacity={0.8} />

      <Circle cx="44" cy="88" r="5.5" fill="#3D5A24" fillOpacity={0.7} />
      <Circle cx="42" cy="86" r="1.5" fill="#A1C67E" fillOpacity={0.8} />

      {/* Leaf pairs along stem */}
      {/* Pair 1 - near top */}
      <Path
        d="M110 15 C102 3, 90 8, 92 20 C94 30, 105 25, 110 15 Z"
        fill="url(#oliveLeafGrad)"
        stroke={color}
        strokeWidth={1}
        strokeOpacity={0.6}
      />
      <Path
        d="M100 24 C112 28, 115 40, 104 44 C94 46, 92 34, 100 24 Z"
        fill="url(#oliveLeafGrad)"
        stroke={color}
        strokeWidth={1}
        strokeOpacity={0.6}
      />

      {/* Pair 2 - mid branch */}
      <Path
        d="M80 44 C68 36, 60 48, 66 58 C72 66, 82 56, 80 44 Z"
        fill="url(#oliveLeafGrad)"
        stroke={color}
        strokeWidth={1}
        strokeOpacity={0.6}
      />
      <Path
        d="M75 52 C84 62, 95 62, 92 74 C88 84, 76 72, 75 52 Z"
        fill="url(#oliveLeafGrad)"
        stroke={color}
        strokeWidth={1}
        strokeOpacity={0.6}
      />

      {/* Pair 3 - lower branch */}
      <Path
        d="M50 72 C38 68, 34 80, 42 88 C50 94, 56 82, 50 72 Z"
        fill="url(#oliveLeafGrad)"
        stroke={color}
        strokeWidth={1}
        strokeOpacity={0.6}
      />
      <Path
        d="M45 80 C55 90, 64 90, 60 100 C55 108, 44 98, 45 80 Z"
        fill="url(#oliveLeafGrad)"
        stroke={color}
        strokeWidth={1}
        strokeOpacity={0.6}
      />
    </Svg>
  );
}

// ─── SVG Botanical Fern Frond ────────────────────────────────────────────────
function FernFrond({
  size = scale(115),
  color = "#557E34",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {/* Central stem */}
      <Path
        d="M15 95 C30 70, 50 40, 85 10"
        stroke={color}
        strokeWidth={1.8}
        strokeOpacity={0.55}
      />
      {/* Pinnules */}
      <Path d="M85 10 C78 14, 74 8, 85 10 Z" fill={color} fillOpacity={0.48} />
      <Path d="M68 28 C56 22, 54 30, 68 28 Z" fill={color} fillOpacity={0.48} />
      <Path d="M72 32 C82 28, 84 36, 72 32 Z" fill={color} fillOpacity={0.48} />
      <Path d="M52 48 C40 44, 38 52, 52 48 Z" fill={color} fillOpacity={0.48} />
      <Path d="M56 52 C68 48, 70 56, 56 52 Z" fill={color} fillOpacity={0.48} />
      <Path d="M38 68 C26 64, 24 72, 38 68 Z" fill={color} fillOpacity={0.48} />
      <Path d="M42 72 C54 68, 56 76, 42 72 Z" fill={color} fillOpacity={0.48} />
    </Svg>
  );
}

// ─── SVG Dewdrop Glint ───────────────────────────────────────────────────────
function Dewdrop({
  size = scale(12),
  color = "#76A24D",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Circle cx="10" cy="10" r="6" fill={color} fillOpacity={0.45} />
      <Circle cx="8" cy="8" r="2" fill="#FFFFFF" fillOpacity={0.9} />
    </Svg>
  );
}

export function SageDecoration({ color = "#557E34" }: SageDecorationProps) {
  const accentColor = "#76A24D";

  return (
    <View style={styles.container} pointerEvents="none">
      {/* ── Top-right ambient herbal haze ───────────────────────────────── */}
      <LinearGradient
        colors={["rgba(85,126,52,0.20)", "rgba(85,126,52,0)"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0.2, y: 0.55 }}
        style={styles.auraTopRight}
      />

      {/* ── Bottom-left morning mist haze ───────────────────────────────── */}
      <LinearGradient
        colors={["rgba(85,126,52,0.18)", "rgba(85,126,52,0)"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 0.55, y: 0.45 }}
        style={styles.auraBottomLeft}
      />

      {/* ── Corner Botanical Anchors ────────────────────────────────────── */}
      <View style={styles.sprigTopRight}>
        <OliveBranch size={scale(145)} color={color} />
      </View>

      <View style={styles.fernBottomLeft}>
        <FernFrond size={scale(120)} color={color} />
      </View>

      {/* ── Skia 120 FPS Minimal Drifting Botanical Leaves ── */}
      <FloatingLeaves />

      {/* ── Subtle Dewdrop Glints ───────────────────────────────────────── */}
      <View style={styles.dew1}>
        <Dewdrop size={scale(13)} color={accentColor} />
      </View>
      <View style={styles.dew2}>
        <Dewdrop size={scale(10)} color={accentColor} />
      </View>
      <View style={styles.dew3}>
        <Dewdrop size={scale(12)} color={accentColor} />
      </View>
      <View style={styles.dew4}>
        <Dewdrop size={scale(9)} color={accentColor} />
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

  // ── Botanical Corner Anchors ───────────────────────────────────────────────
  sprigTopRight: {
    position: "absolute",
    top: -hp(1.5),
    right: -wp(8),
    opacity: 0.38,
    transform: [{ rotate: "15deg" }],
  },
  fernBottomLeft: {
    position: "absolute",
    bottom: hp(7),
    left: -wp(5),
    opacity: 0.28,
    transform: [{ rotate: "-18deg" }],
  },

  // ── Dewdrops ───────────────────────────────────────────────────────────────
  dew1: {
    position: "absolute",
    top: hp(11),
    right: wp(28),
    opacity: 0.65,
  },
  dew2: {
    position: "absolute",
    top: hp(39),
    left: wp(36),
    opacity: 0.5,
  },
  dew3: {
    position: "absolute",
    top: hp(55),
    right: wp(18),
    opacity: 0.6,
  },
  dew4: {
    position: "absolute",
    bottom: hp(27),
    right: wp(30),
    opacity: 0.52,
  },
});
