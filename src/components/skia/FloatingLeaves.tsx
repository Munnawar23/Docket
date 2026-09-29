import React, { useMemo } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import {
  Canvas,
  Group,
  Path,
  Skia,
  vec,
} from "@shopify/react-native-skia";
import {
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
} from "react-native-reanimated";
import { useAppTheme } from "@/hooks/useAppTheme";
import { hp, scale, wp } from "@/helpers/responsiveHelper";

export interface FloatingLeavesProps {
  style?: StyleProp<ViewStyle>;
}

const SCREEN_WIDTH = wp(100);
const SCREEN_HEIGHT = hp(100);

export const FloatingLeaves = React.memo(function FloatingLeaves({
  style,
}: FloatingLeavesProps) {
  const { themeMode } = useAppTheme();

  // 1. Shared continuous animation clock on UI thread (120 FPS)
  const animTime = useSharedValue(0);

  // Precomputed canvas boundaries & dimensions (pure numbers for UI worklet)
  const W_TOTAL = SCREEN_WIDTH + 80;
  const H_TOTAL = SCREEN_HEIGHT + 100;
  const screenH = SCREEN_HEIGHT;

  // 2. 120 FPS Frame Callback (Zero React re-renders, 100% UI-thread)
  useFrameCallback((frameInfo) => {
    "worklet";
    if (!frameInfo.timeSincePreviousFrame) return;
    const dt = Math.min(frameInfo.timeSincePreviousFrame / 1000, 0.05);
    animTime.value += dt;
  });

  // 3. Pre-allocated Botanical Leaf Vectors (Created once, zero GC pressure)
  // Lanceolate classic olive leaf (centered at origin)
  const oliveLeafPath = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        "M 0 -17 C 11 -8, 12 8, 0 17 C -12 8, -11 -8, 0 -17 Z"
      )!,
    []
  );

  // Fine central rib / sunlight vein
  const oliveVeinPath = useMemo(
    () => Skia.Path.MakeFromSVGString("M 0 -13 L 0 13")!,
    []
  );

  // Curved fluttering sage leaf (organic botanical curve)
  const curvedLeafPath = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        "M 0 -16 C 8 -9, 13 4, 1 16 C -6 8, -9 -7, 0 -16 Z"
      )!,
    []
  );

  const curvedVeinPath = useMemo(
    () => Skia.Path.MakeFromSVGString("M 0 -12 C 4 -1, 3 7, 0 12")!,
    []
  );

  // 4. Five Elegantly Staggered Leaves with Organic Wind Physics
  // ── Leaf 1: Gentle Primary Olive Leaf (Mid-screen glide) ────────────────
  const leaf1Transform = useDerivedValue(() => {
    const t = animTime.value;
    const startY = H_TOTAL * 0.12;
    const startX = SCREEN_WIDTH * 0.22;
    const vy = 21; // px/sec downward drift
    const vx = 11; // px/sec horizontal breeze

    const rawY = (startY + vy * t) % H_TOTAL;
    const y = rawY - 50;

    const sway = Math.sin(t * 1.35 + 0.2) * 22;
    const rawX = (startX + vx * t) % W_TOTAL;
    const x = rawX - 40 + sway;

    const tilt = 0.45 + Math.sin(t * 1.35 + 0.2) * 0.32;
    const flutter = Math.cos(t * 1.75 + 0.5);
    const scaleX = 0.95 * (0.42 + 0.58 * Math.abs(flutter));
    const scaleY = 0.95 * (0.88 + 0.12 * flutter);

    return [
      { translateX: x },
      { translateY: y },
      { rotate: tilt },
      { scaleX },
      { scaleY },
    ];
  });

  const leaf1Opacity = useDerivedValue(() => {
    const t = animTime.value;
    const startY = H_TOTAL * 0.12;
    const rawY = (startY + 21 * t) % H_TOTAL;
    const y = rawY - 50;
    const topFade = Math.max(0, Math.min(1, (y + 40) / 70));
    const bottomFade = Math.max(0, Math.min(1, (screenH + 30 - y) / 70));
    return 0.58 * topFade * bottomFade;
  });

  // ── Leaf 2: Small Delicate Sage Leaf (Right side flutter) ───────────────
  const leaf2Transform = useDerivedValue(() => {
    const t = animTime.value;
    const startY = H_TOTAL * 0.48;
    const startX = SCREEN_WIDTH * 0.72;
    const vy = 18;
    const vx = 14;

    const rawY = (startY + vy * t) % H_TOTAL;
    const y = rawY - 50;

    const sway = Math.sin(t * 1.65 + 1.8) * 17;
    const rawX = (startX + vx * t) % W_TOTAL;
    const x = rawX - 40 + sway;

    const tilt = 0.35 + Math.sin(t * 1.65 + 1.8) * 0.28;
    const flutter = Math.cos(t * 2.2 + 1.2);
    const scaleX = 0.72 * (0.45 + 0.55 * Math.abs(flutter));
    const scaleY = 0.72 * (0.86 + 0.14 * flutter);

    return [
      { translateX: x },
      { translateY: y },
      { rotate: tilt },
      { scaleX },
      { scaleY },
    ];
  });

  const leaf2Opacity = useDerivedValue(() => {
    const t = animTime.value;
    const startY = H_TOTAL * 0.48;
    const rawY = (startY + 18 * t) % H_TOTAL;
    const y = rawY - 50;
    const topFade = Math.max(0, Math.min(1, (y + 40) / 70));
    const bottomFade = Math.max(0, Math.min(1, (screenH + 30 - y) / 70));
    return 0.52 * topFade * bottomFade;
  });

  // ── Leaf 3: Soft Drifting Olive Leaf (High altitude descent) ────────────
  const leaf3Transform = useDerivedValue(() => {
    const t = animTime.value;
    const startY = H_TOTAL * 0.76;
    const startX = SCREEN_WIDTH * 0.42;
    const vy = 25;
    const vx = 12;

    const rawY = (startY + vy * t) % H_TOTAL;
    const y = rawY - 50;

    const sway = Math.sin(t * 1.2 + 3.1) * 25;
    const rawX = (startX + vx * t) % W_TOTAL;
    const x = rawX - 40 + sway;

    const tilt = 0.52 + Math.sin(t * 1.2 + 3.1) * 0.35;
    const flutter = Math.cos(t * 1.5 + 2.4);
    const scaleX = 1.02 * (0.40 + 0.60 * Math.abs(flutter));
    const scaleY = 1.02 * (0.90 + 0.10 * flutter);

    return [
      { translateX: x },
      { translateY: y },
      { rotate: tilt },
      { scaleX },
      { scaleY },
    ];
  });

  const leaf3Opacity = useDerivedValue(() => {
    const t = animTime.value;
    const startY = H_TOTAL * 0.76;
    const rawY = (startY + 25 * t) % H_TOTAL;
    const y = rawY - 50;
    const topFade = Math.max(0, Math.min(1, (y + 40) / 70));
    const bottomFade = Math.max(0, Math.min(1, (screenH + 30 - y) / 70));
    return 0.60 * topFade * bottomFade;
  });

  // ── Leaf 4: Tiny Accent Leaf (Upper ambient drift) ──────────────────────
  const leaf4Transform = useDerivedValue(() => {
    const t = animTime.value;
    const startY = H_TOTAL * 0.32;
    const startX = SCREEN_WIDTH * 0.08;
    const vy = 16;
    const vx = 9;

    const rawY = (startY + vy * t) % H_TOTAL;
    const y = rawY - 50;

    const sway = Math.sin(t * 1.9 + 4.2) * 14;
    const rawX = (startX + vx * t) % W_TOTAL;
    const x = rawX - 40 + sway;

    const tilt = 0.38 + Math.sin(t * 1.9 + 4.2) * 0.25;
    const flutter = Math.cos(t * 2.6 + 0.8);
    const scaleX = 0.60 * (0.48 + 0.52 * Math.abs(flutter));
    const scaleY = 0.60 * (0.85 + 0.15 * flutter);

    return [
      { translateX: x },
      { translateY: y },
      { rotate: tilt },
      { scaleX },
      { scaleY },
    ];
  });

  const leaf4Opacity = useDerivedValue(() => {
    const t = animTime.value;
    const startY = H_TOTAL * 0.32;
    const rawY = (startY + 16 * t) % H_TOTAL;
    const y = rawY - 50;
    const topFade = Math.max(0, Math.min(1, (y + 40) / 70));
    const bottomFade = Math.max(0, Math.min(1, (screenH + 30 - y) / 70));
    return 0.46 * topFade * bottomFade;
  });

  // ── Leaf 5: Graceful Lower Flank Leaf (Bottom-left breeze) ──────────────
  const leaf5Transform = useDerivedValue(() => {
    const t = animTime.value;
    const startY = H_TOTAL * 0.90;
    const startX = SCREEN_WIDTH * 0.82;
    const vy = 22;
    const vx = 13;

    const rawY = (startY + vy * t) % H_TOTAL;
    const y = rawY - 50;

    const sway = Math.sin(t * 1.45 + 5.0) * 20;
    const rawX = (startX + vx * t) % W_TOTAL;
    const x = rawX - 40 + sway;

    const tilt = 0.42 + Math.sin(t * 1.45 + 5.0) * 0.30;
    const flutter = Math.cos(t * 1.9 + 3.6);
    const scaleX = 0.82 * (0.44 + 0.56 * Math.abs(flutter));
    const scaleY = 0.82 * (0.87 + 0.13 * flutter);

    return [
      { translateX: x },
      { translateY: y },
      { rotate: tilt },
      { scaleX },
      { scaleY },
    ];
  });

  const leaf5Opacity = useDerivedValue(() => {
    const t = animTime.value;
    const startY = H_TOTAL * 0.90;
    const rawY = (startY + 22 * t) % H_TOTAL;
    const y = rawY - 50;
    const topFade = Math.max(0, Math.min(1, (y + 40) / 70));
    const bottomFade = Math.max(0, Math.min(1, (screenH + 30 - y) / 70));
    return 0.50 * topFade * bottomFade;
  });

  // 5. Harmonious Botanical Palette (Tailored for Sage Theme)
  const oliveColor = "#557E34";
  const oliveStroke = "rgba(45, 75, 25, 0.55)";
  const sageColor = "#6E9845";
  const sageStroke = "rgba(55, 88, 32, 0.55)";
  const veinColor = "rgba(255, 255, 255, 0.42)";

  if (themeMode !== "sage") {
    return null;
  }

  return (
    <View style={[styles.container, style]} pointerEvents="none">
      <Canvas style={styles.canvas}>
        {/* Leaf 1 - Olive */}
        <Group transform={leaf1Transform} opacity={leaf1Opacity} origin={vec(0, 0)}>
          <Path path={oliveLeafPath} color={oliveColor} style="fill" />
          <Path
            path={oliveLeafPath}
            color={oliveStroke}
            style="stroke"
            strokeWidth={0.9}
          />
          <Path
            path={oliveVeinPath}
            color={veinColor}
            style="stroke"
            strokeWidth={0.8}
          />
        </Group>

        {/* Leaf 2 - Curved Sage */}
        <Group transform={leaf2Transform} opacity={leaf2Opacity} origin={vec(0, 0)}>
          <Path path={curvedLeafPath} color={sageColor} style="fill" />
          <Path
            path={curvedLeafPath}
            color={sageStroke}
            style="stroke"
            strokeWidth={0.8}
          />
          <Path
            path={curvedVeinPath}
            color={veinColor}
            style="stroke"
            strokeWidth={0.7}
          />
        </Group>

        {/* Leaf 3 - Olive */}
        <Group transform={leaf3Transform} opacity={leaf3Opacity} origin={vec(0, 0)}>
          <Path path={oliveLeafPath} color={oliveColor} style="fill" />
          <Path
            path={oliveLeafPath}
            color={oliveStroke}
            style="stroke"
            strokeWidth={1.0}
          />
          <Path
            path={oliveVeinPath}
            color={veinColor}
            style="stroke"
            strokeWidth={0.8}
          />
        </Group>

        {/* Leaf 4 - Curved Sage */}
        <Group transform={leaf4Transform} opacity={leaf4Opacity} origin={vec(0, 0)}>
          <Path path={curvedLeafPath} color={sageColor} style="fill" />
          <Path
            path={curvedLeafPath}
            color={sageStroke}
            style="stroke"
            strokeWidth={0.7}
          />
          <Path
            path={curvedVeinPath}
            color={veinColor}
            style="stroke"
            strokeWidth={0.6}
          />
        </Group>

        {/* Leaf 5 - Olive */}
        <Group transform={leaf5Transform} opacity={leaf5Opacity} origin={vec(0, 0)}>
          <Path path={oliveLeafPath} color={oliveColor} style="fill" />
          <Path
            path={oliveLeafPath}
            color={oliveStroke}
            style="stroke"
            strokeWidth={0.9}
          />
          <Path
            path={oliveVeinPath}
            color={veinColor}
            style="stroke"
            strokeWidth={0.8}
          />
        </Group>
      </Canvas>
    </View>
  );
});

export default FloatingLeaves;

const styles = StyleSheet.create({
  container: {
    ...(StyleSheet.absoluteFill as any),
    overflow: "hidden",
  },
  canvas: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
