import React, { useMemo } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import {
  Canvas,
  DashPathEffect,
  Group,
  Line,
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

export interface CartoonSkyProps {
  style?: StyleProp<ViewStyle>;
}

const SCREEN_WIDTH = wp(100);
const SCREEN_HEIGHT = hp(100);

export const CartoonSky = React.memo(function CartoonSky({
  style,
}: CartoonSkyProps) {
  const { themeMode } = useAppTheme();

  // Trajectory Dimensions (centered vertically in screen)
  const planeStartY = SCREEN_HEIGHT * 0.48;
  const loopBaseY = SCREEN_HEIGHT * 0.54;
  const loopCenterX = SCREEN_WIDTH * 0.40;
  const loopRadiusX = scale(40);
  const loopRadiusY = scale(48);

  const bobScale = scale(10);
  const forwardStep = scale(35);
  const extendRight = scale(70);
  const waveHeight = scale(18);
  const dropHeight = scale(28);
  const driftSpeed = scale(12);
  const slowDriftSpeed = scale(8);

  // 1. Shared values for 120 FPS UI-thread animations
  const flightDirection = useSharedValue(1); // 1 = Left-to-Right, -1 = Right-to-Left
  const flightTime = useSharedValue(0);
  const planeX = useSharedValue(-60);
  const planeY = useSharedValue(planeStartY);
  const planeAngle = useSharedValue(0);
  const planeScaleY = useSharedValue(1);
  const planeOpacity = useSharedValue(0);

  // Cartoon loop-de-loop wake trail
  const loopOpacity = useSharedValue(0);
  const loopDriftX = useSharedValue(0);

  // Cartoon wind gusts
  const wind1X = useSharedValue(-200);
  const wind1Opacity = useSharedValue(0);

  const wind2X = useSharedValue(-180);
  const wind2Opacity = useSharedValue(0);

  // Small floating wind tufts
  const tuft1X = useSharedValue(-60);
  const tuft1Opacity = useSharedValue(0);

  // 3. 120 FPS Frame Callback (UI-thread worklet)
  useFrameCallback((frameInfo) => {
    "worklet";
    if (!frameInfo.timeSincePreviousFrame) return;

    const dt = Math.min(frameInfo.timeSincePreviousFrame / 1000, 0.05);

    // Continuous flight cycle: 7.0 seconds period (1.0s pause between flights)
    const CYCLE_DURATION = 7.0;
    let t = flightTime.value + dt;
    if (t >= CYCLE_DURATION) {
      t = 0;
      flightDirection.value = flightDirection.value === 1 ? -1 : 1;
    }
    flightTime.value = t;

    // ── Wind Gust 1 (Upper Sky, precedes the loop) ───────────────────
    // Sweeps across from t = 0.3s to 3.8s
    if (t >= 0.3 && t < 3.8) {
      const wProgress = (t - 0.3) / 3.5;
      wind1X.value = -120 + wProgress * (SCREEN_WIDTH + 240);
      if (wProgress < 0.2) {
        wind1Opacity.value = wProgress / 0.2;
      } else if (wProgress > 0.75) {
        wind1Opacity.value = Math.max(0, (1 - wProgress) / 0.25);
      } else {
        wind1Opacity.value = 1;
      }
    } else {
      wind1Opacity.value = 0;
    }

    // ── Wind Gust 2 (Lower-mid sky, accompanies exit) ─────────────────
    // Sweeps across from t = 3.4s to 6.6s
    if (t >= 3.4 && t < 6.6) {
      const wProgress = (t - 3.4) / 3.2;
      wind2X.value = -100 + wProgress * (SCREEN_WIDTH + 220);
      if (wProgress < 0.2) {
        wind2Opacity.value = wProgress / 0.2;
      } else if (wProgress > 0.75) {
        wind2Opacity.value = Math.max(0, (1 - wProgress) / 0.25);
      } else {
        wind2Opacity.value = 0.9;
      }
    } else {
      wind2Opacity.value = 0;
    }

    // ── Floating Wind Tuft (Gentle breeze accent) ─────────────────────
    if (t >= 0.8 && t < 4.5) {
      const tuftProgress = (t - 0.8) / 3.7;
      tuft1X.value = -40 + tuftProgress * (SCREEN_WIDTH + 100);
      tuft1Opacity.value = Math.sin(tuftProgress * Math.PI) * 0.75;
    } else {
      tuft1Opacity.value = 0;
    }

    // ── Paper Plane Trajectory ─────────────────────────────────────────
    const FLIGHT_ACTIVE = 6.0; // flies for 6 seconds, rests for 1.0 second

    if (t < FLIGHT_ACTIVE) {
      planeOpacity.value = 1;

      let curX = -50;
      let curY = planeStartY;
      let vx = 1;
      let vy = 0;
      let bank = 1;

      if (t < 1.8) {
        // Phase 1: Gentle Glide-In from Left Sky
        const p = t / 1.8;
        curX = -50 + p * (loopCenterX + 50);
        const bob = Math.sin(p * Math.PI * 2.5) * bobScale;
        curY = planeStartY + p * (loopBaseY - planeStartY) + bob;

        vx = (loopCenterX + 50) / 1.8;
        vy = (loopBaseY - planeStartY) / 1.8 + Math.cos(p * Math.PI * 2.5) * bobScale * (Math.PI * 2.5) / 1.8;
        bank = 1;
      } else if (t < 3.4) {
        // Phase 2: Iconic Cartoon Loop-de-Loop!
        const p = (t - 1.8) / 1.6;
        const angle = p * Math.PI * 2;

        // Loop center slowly drifts forward as it loops
        const forwardOffset = p * forwardStep;
        curX = loopCenterX + loopRadiusX * Math.sin(angle) + forwardOffset;
        curY = loopBaseY - loopRadiusY * (1 - Math.cos(angle));

        // Derivative for exact tangent orientation
        vx = loopRadiusX * Math.cos(angle) * (Math.PI * 2 / 1.6) + forwardStep / 1.6;
        vy = -loopRadiusY * Math.sin(angle) * (Math.PI * 2 / 1.6);

        // 3D origami banking squash during inverted loop
        bank = 1 - Math.abs(Math.sin(angle)) * 0.35;

        // Activate loop wake trail
        loopOpacity.value = Math.min(1, p * 2.5);
        loopDriftX.value = 0;
      } else {
        // Phase 3: High-Speed Cruise & Swoop Out to Right
        const p = (t - 3.4) / 2.6;
        const startX = loopCenterX + forwardStep;
        curX = startX + p * (SCREEN_WIDTH - startX + extendRight);

        const wave = Math.sin(p * Math.PI * 2) * waveHeight;
        curY = loopBaseY + wave - p * dropHeight;

        vx = (SCREEN_WIDTH - startX + extendRight) / 2.6;
        vy = Math.cos(p * Math.PI * 2) * waveHeight * (Math.PI * 2 / 2.6) - dropHeight / 2.6;
        bank = 1;

        // Loop wake lingers and drifts gently with the breeze
        loopDriftX.value += dt * driftSpeed;
        loopOpacity.value = Math.max(0, 1 - p * 1.5);
      }

      planeX.value = curX;
      planeY.value = curY;
      planeAngle.value = Math.atan2(vy, vx);
      planeScaleY.value = bank;
    } else {
      // Phase 4: Offscreen rest
      planeOpacity.value = 0;
      planeX.value = -100;
      loopOpacity.value = Math.max(0, loopOpacity.value - dt * 1.5);
      loopDriftX.value += dt * slowDriftSpeed;
    }
  });

  // 4. Vector Paths (Created once, zero GC pressure)
  // Origami Paper Plane Facets (Centered at 0, 0, nose points +X)
  const topWingPath = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        "M 22 0 L -15 -13 L -10 0 Z"
      )!,
    []
  );

  const bottomWingPath = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        "M 22 0 L -10 0 L -15 13 Z"
      )!,
    []
  );

  const keelFoldPath = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        "M 16 0 L -10 0 L -6 4.5 Z"
      )!,
    []
  );

  // Cartoon Loop-the-Loop Dashed Wake Ring
  const loopRingPath = useMemo(() => {
    const steps = 36;
    let d = "";
    for (let i = 0; i <= steps; i++) {
      const p = i / steps;
      const angle = p * Math.PI * 2;
      const x = (loopCenterX + loopRadiusX * Math.sin(angle) + p * forwardStep).toFixed(1);
      const y = (loopBaseY - loopRadiusY * (1 - Math.cos(angle))).toFixed(1);
      if (i === 0) {
        d += `M ${x} ${y}`;
      } else {
        d += ` L ${x} ${y}`;
      }
    }
    return Skia.Path.MakeFromSVGString(d)!;
  }, [loopCenterX, loopBaseY, loopRadiusX, loopRadiusY, forwardStep]);

  // Classic Vintage Cartoon Wind Spirals (With spiral head curl)
  const windSpiral1 = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        "M 0 10 C 45 6, 95 16, 145 10 C 175 6, 198 -8, 192 -22 C 184 -34, 164 -32, 160 -18 C 156 -6, 170 0, 176 -6"
      )!,
    []
  );

  const windSpiral2 = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        "M 0 0 C 35 -4, 70 4, 110 -2 C 130 -6, 145 -18, 138 -28 C 130 -36, 115 -32, 114 -20 C 113 -10, 122 -6, 126 -10"
      )!,
    []
  );

  const windWhisp = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        "M 0 0 C 30 -3, 60 3, 90 0"
      )!,
    []
  );

  // 5. Reactive Transforms (Hardware-accelerated Skia transforms)
  const sceneOrigin = useMemo(() => vec(SCREEN_WIDTH / 2, 0), []);
  const sceneTransform = useDerivedValue(() => [
    { scaleX: flightDirection.value },
  ]);

  const planeTransform = useDerivedValue(() => [
    { translateX: planeX.value },
    { translateY: planeY.value },
    { rotate: planeAngle.value },
    { scaleY: planeScaleY.value },
  ]);

  const loopWakeTransform = useDerivedValue(() => [
    { translateX: loopDriftX.value },
  ]);

  const wind1Transform = useDerivedValue(() => [
    { translateX: wind1X.value },
    { translateY: SCREEN_HEIGHT * 0.38 },
  ]);

  const wind2Transform = useDerivedValue(() => [
    { translateX: wind2X.value },
    { translateY: SCREEN_HEIGHT * 0.64 },
  ]);

  const tuft1Transform = useDerivedValue(() => [
    { translateX: tuft1X.value },
    { translateY: SCREEN_HEIGHT * 0.56 },
  ]);

  // Color Palette tailored for Sky Theme
  const planeWhite = "#FFFFFF";
  const planeShade = "#E0F2FE";
  const planeKeel = "#BAE6FD";
  const planeStroke = "rgba(2, 132, 199, 0.45)";
  const windColor = "rgba(255, 255, 255, 0.72)";
  const windSkyTint = "rgba(2, 132, 199, 0.35)";

  if (themeMode !== "sky") {
    return null;
  }

  return (
    <View style={[styles.container, style]} pointerEvents="none">
      <Canvas style={styles.canvas}>
        <Group origin={sceneOrigin} transform={sceneTransform}>
          {/* ── 1. Classic Cartoon Wind Gusts (Swirling Spirals) ────────── */}
        {/* Wind Gust 1 — Upper Sky with spiral curl */}
        <Group transform={wind1Transform} opacity={wind1Opacity}>
          <Path
            path={windSpiral1}
            color={windColor}
            style="stroke"
            strokeWidth={2.4}
            strokeCap="round"
          />
          {/* Accent secondary wind line */}
          <Path
            path={windWhisp}
            color={windSkyTint}
            style="stroke"
            strokeWidth={1.5}
            strokeCap="round"
          />
        </Group>

        {/* Wind Gust 2 — Mid-Lower Sky */}
        <Group transform={wind2Transform} opacity={wind2Opacity}>
          <Path
            path={windSpiral2}
            color={windColor}
            style="stroke"
            strokeWidth={2.0}
            strokeCap="round"
          />
        </Group>

        {/* Floating Breeze Tuft */}
        <Group transform={tuft1Transform} opacity={tuft1Opacity}>
          <Path
            path={windWhisp}
            color={windColor}
            style="stroke"
            strokeWidth={1.6}
            strokeCap="round"
          />
        </Group>

        {/* ── 2. Dashed Loop-the-Loop Cartoon Wake Trail ─────────────── */}
        <Group transform={loopWakeTransform} opacity={loopOpacity}>
          <Path
            path={loopRingPath}
            color={windSkyTint}
            style="stroke"
            strokeWidth={1.8}
            strokeCap="round"
          >
            <DashPathEffect intervals={[5, 7]} />
          </Path>
        </Group>

        {/* ── 3. Origami Paper Airplane ───────────────────────────────── */}
        <Group transform={planeTransform} opacity={planeOpacity} origin={vec(0, 0)}>
          {/* Underbody Keel Crease (Cast Shadow) */}
          <Path
            path={keelFoldPath}
            color={planeKeel}
            style="fill"
          />
          <Path
            path={keelFoldPath}
            color={planeStroke}
            style="stroke"
            strokeWidth={0.8}
          />

          {/* Lower / Shaded Wing */}
          <Path
            path={bottomWingPath}
            color={planeShade}
            style="fill"
          />
          <Path
            path={bottomWingPath}
            color={planeStroke}
            style="stroke"
            strokeWidth={1.0}
            strokeJoin="round"
          />

          {/* Upper / Highlighted Wing (Bright Crisp White) */}
          <Path
            path={topWingPath}
            color={planeWhite}
            style="fill"
          />
          <Path
            path={topWingPath}
            color={planeStroke}
            style="stroke"
            strokeWidth={1.0}
            strokeJoin="round"
          />

          {/* Crisp Center Spine Fold Line */}
          <Line
            p1={vec(-10, 0)}
            p2={vec(22, 0)}
            color={planeStroke}
            strokeWidth={1.1}
          />
        </Group>
      </Group>
    </Canvas>
  </View>
  );
});

export default CartoonSky;

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
