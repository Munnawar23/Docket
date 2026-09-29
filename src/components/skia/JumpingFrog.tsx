import React, { useCallback, useEffect, useMemo } from "react";
import { StyleSheet, View, Pressable, type StyleProp, type ViewStyle } from "react-native";
import {
  Canvas,
  Circle,
  Group,
  Path,
  Skia,
  vec,
} from "@shopify/react-native-skia";
import {
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Haptics } from "@/lib/haptics";
import { scale, verticalScale } from "@/helpers/responsiveHelper";

export interface JumpingFrogProps {
  /** Animated translateX of the active tab pill */
  activeX?: SharedValue<number>;
  /** Width of a single tab option */
  tabWidth?: number;
  /** Total container width */
  containerWidth?: number;
  style?: StyleProp<ViewStyle>;
}

const CANVAS_HEIGHT = verticalScale(74);

export const JumpingFrog = React.memo(function JumpingFrog({
  activeX,
  tabWidth = 0,
  containerWidth = scale(190),
  style,
}: JumpingFrogProps) {
  const { colors, themeMode } = useAppTheme();

  // Precomputed responsive dimensions (numbers safely captured by UI worklet)
  const hopHeight = scale(18);

  // 1. Shared values for 120 FPS UI thread animations
  const frogX = useSharedValue(containerWidth / 2);
  const idleTime = useSharedValue(0);
  const blinkTimer = useSharedValue(0);
  const hopProgress = useSharedValue(0);
  const jumpY = useSharedValue(0);
  const direction = useSharedValue(1); // 1 = facing right, -1 = facing left
  const turnScale = useSharedValue(1); // Smooth 2.5D turning scale
  const jumpDir = useSharedValue(0); // Direction of the leap
  const cloverOpacity = useSharedValue(0);
  const cloverY = useSharedValue(0);

  const tabWidthShared = useSharedValue(tabWidth);
  const containerWidthShared = useSharedValue(containerWidth);

  useEffect(() => {
    tabWidthShared.value = tabWidth;
  }, [tabWidth, tabWidthShared]);

  useEffect(() => {
    containerWidthShared.value = containerWidth;
  }, [containerWidth, containerWidthShared]);

  // 2. 120 FPS UI Thread Frame Loop (Zero React re-renders)
  useFrameCallback((frameInfo) => {
    "worklet";
    if (!frameInfo.timeSincePreviousFrame) return;

    const dt = Math.min(frameInfo.timeSincePreviousFrame / 1000, 0.05);
    idleTime.value += dt;
    blinkTimer.value += dt;

    // Track active tab position smoothly on UI thread
    let targetX = containerWidthShared.value / 2;
    if (activeX !== undefined && tabWidthShared.value > 0) {
      targetX = activeX.value + tabWidthShared.value / 2;
    }

    const dx = targetX - frogX.value;
    const isMoving = Math.abs(dx) > 0.8;

    // 2.5D Orientation: face destination when moving, face other tab when resting
    let desiredDir = direction.value;
    if (isMoving) {
      desiredDir = dx > 0 ? 1 : -1;
      jumpDir.value = desiredDir;
      // Athletic leap arc progression
      hopProgress.value = Math.min(1, hopProgress.value + dt * 4.2);
      // Fluid movement across the tab bar
      frogX.value += dx * Math.min(1, dt * 9.5);
    } else {
      hopProgress.value = Math.max(0, hopProgress.value - dt * 6.5);
      jumpDir.value = 0;
      // When settled on left tab (Tab 0), face right; on right tab, face left
      if (tabWidthShared.value > 0 && activeX !== undefined) {
        const tabIndex = Math.round(activeX.value / tabWidthShared.value);
        desiredDir = tabIndex === 0 ? 1 : -1;
      }
    }

    direction.value = desiredDir;
    // Smooth 2.5D turning interpolation (turns to look left or right)
    turnScale.value += (direction.value - turnScale.value) * Math.min(1, dt * 12);
  });

  // 3. Realistic Tree Frog Anatomy Vectors (Created once, zero GC pressure)
  // A. Main Body Silhouette (Streamlined amphibian back, pelvic hump, tapered snout)
  const frogBodyPath = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        "M -15 16 C -17 11.5, -14.5 5, -8 2 C -5 0.5, -2 -0.2, 1 -0.5 C 2 -4.8, 5.8 -6.5, 9 -4.5 C 11.5 -3, 14 0, 17 3 C 18.2 4.2, 17.5 5.8, 15.5 7.2 C 12.5 8.5, 8.5 10, 4.5 11.5 C 0.5 13.8, -3 15.5, -7 16.8 C -11 17.5, -14 17, -15 16 Z"
      )!,
    []
  );

  // B. Creamy Gular Throat & Ventral Underbelly
  const frogBellyPath = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        "M 15.5 7.2 C 12.5 8.5, 8.5 10, 4.5 11.5 C 0.5 13.8, -3 15.5, -7 16.8 C -11 17.5, -14 17, -15 16 C -12 14.5, -6 12, 1 9.5 C 7 7.5, 12 6.8, 15.5 7.2 Z"
      )!,
    []
  );

  // C. Dorsal Lateral Gold-Lime Accent Ridge (Runs from snout past eye along flank)
  const lateralRidgePath = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        "M 16.5 3.5 C 13.5 1, 9.5 -0.5, 5.5 0.8 C 0.5 2.2, -5.5 4.5, -12 9.5"
      )!,
    []
  );

  // D. Realistic Folded Hind Leg (Muscular thigh & folded saltatorial shin)
  const hindThighPath = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        "M -14 7 C -8 4.5, -1.5 7.5, -1.8 13 C -2 17, -6.5 18.5, -12 16.5 C -15 14.5, -16 10.5, -14 7 Z"
      )!,
    []
  );

  // Folded Shin & Ankle
  const hindShinPath = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        "M -12 16.5 C -8 18, -4 18.8, 0 19 L -2 17.2 C -6 16.8, -9 15.8, -12 16.5 Z"
      )!,
    []
  );

  // Hind Foot with 3 Long Slender Toes
  const hindToesPath = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        "M -2 18.5 L 1 19.5 M -1 18.8 L 3.5 20 M 0 18.8 L 6.5 20.2"
      )!,
    []
  );

  // E. Forelimb (Slender forearm resting on tab pill)
  const foreLegPath = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        "M 5 11.5 C 5.5 14, 5.8 17, 5.8 19.5 L 8.2 19.5 C 7.8 16.8, 7.2 14, 6.8 11.5 Z"
      )!,
    []
  );

  // Forefoot Slender Digits
  const foreDigitsPath = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        "M 5.8 19.5 L 4.2 20.4 M 6.8 19.5 L 7 20.8 M 7.8 19.5 L 9.8 20.5"
      )!,
    []
  );

  // F. Shaded Far-Side Limbs (Visible behind chest in shadow)
  const farForeLegPath = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        "M 9.5 10.5 L 12 17 L 14.2 18 L 12.8 18 L 10.8 11 Z"
      )!,
    []
  );

  const farHindFootPath = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        "M -4 17.5 L -1 19.2 L 2 19 L 0.5 18 Z"
      )!,
    []
  );

  // Friendly 3/4 Smiling Mouth
  const mouth2dPath = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        "M 7 7.2 Q 11 9.5 14.5 6.5"
      )!,
    []
  );

  // G. Multi-Layer Ground Shadows
  const ambientShadowPath = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        "M -15 0 C -15 -4.5, 15 -4.5, 15 0 C 15 4.5, -15 4.5, -15 0 Z"
      )!,
    []
  );

  const coreShadowPath = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        "M -10 0 C -10 -2.5, 10 -2.5, 10 0 C 10 2.5, -10 2.5, -10 0 Z"
      )!,
    []
  );

  // Floating Lucky Four-Leaf Clover on Tap
  const cloverPath = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        "M 0 0 C -3 -3, -6 0, -3 3 C 0 0, 0 0, 0 0 C -3 3, 0 6, 3 3 C 0 0, 0 0, 0 0 C 3 3, 6 0, 3 -3 C 0 0, 0 0, 0 0 C 3 -3, 0 -6, -3 -3 Z"
      )!,
    []
  );

  // 4. UI Thread Reactive Transforms (2.5D Leap Arc & Turn)
  const bodyTransform = useDerivedValue(() => {
    const p = hopProgress.value;
    const hopArc = Math.sin(p * Math.PI);

    // Parabolic leap height into the air
    const hopY = -hopArc * hopHeight;

    // Organic amphibian gular throat breathing pulsation
    const gularPulse = (1 - hopArc) * Math.sin(idleTime.value * 4.8) * 0.45;

    // Dynamic squash-and-stretch during leap
    let scaleXVal = 1.0;
    let scaleYVal = 1.0;
    if (p > 0.08 && p < 0.92) {
      scaleYVal = 1.0 + hopArc * 0.28;
      scaleXVal = 1.0 - hopArc * 0.15;
    } else if (p > 0) {
      scaleYVal = 0.82;
      scaleXVal = 1.18;
    }

    // Aerodynamic tilt during jump
    const tilt = jumpDir.value * hopArc * 0.16;

    return [
      { translateX: frogX.value },
      { translateY: 44 + gularPulse + hopY + jumpY.value },
      { scaleX: turnScale.value * scaleXVal },
      { scaleY: scaleYVal },
      { rotate: tilt },
    ];
  });

  // 2.5D Ground Cast Shadows (Stay on tab track, shrink and soften during high leap)
  const shadowTransform = useDerivedValue(() => {
    const p = hopProgress.value;
    const hopArc = Math.sin(p * Math.PI);
    const scaleFactor = Math.max(0.35, 1.0 - hopArc * 0.5);

    return [
      { translateX: frogX.value },
      { translateY: 64.5 },
      { scaleX: Math.abs(turnScale.value) * scaleFactor },
      { scaleY: scaleFactor },
    ];
  });

  const shadowOpacity = useDerivedValue(() => {
    const p = hopProgress.value;
    const hopArc = Math.sin(p * Math.PI);
    return Math.max(0.18, 0.5 - hopArc * 0.32);
  });

  // Natural smooth frog eye blink (smooth close and open over 0.18s)
  const eyeScaleY = useDerivedValue(() => {
    const cycle = blinkTimer.value % 3.8;
    if (cycle > 3.62) {
      const p = (cycle - 3.62) / 0.18;
      return 1.0 - Math.sin(p * Math.PI) * 0.92;
    }
    return 1.0;
  });

  const eyeTransform = useDerivedValue(() => [
    { scaleY: eyeScaleY.value },
  ]);

  const cloverTransform = useDerivedValue(() => [
    { translateX: frogX.value },
    { translateY: 24 + cloverY.value },
    { scale: cloverOpacity.value },
  ]);

  // 5. Realistic Tree Frog Palette (Rich Moss & Porcelain Cream)
  const frogSkinBack = "#5D9136"; // Radiant mossy green dorsal
  const frogSkinFar = "#436925"; // Shaded far-side olive for realistic depth
  const frogSkinHighlight = "rgba(182, 222, 126, 0.45)"; // Dewy dorsal highlight
  const frogBelly = "#F2F7EC"; // Soft creamy porcelain belly
  const strokeColor = "#1D3210"; // Fine deep forest outline
  const eyeWhite = "#F8FAF5";
  const pupilColor = "#0D1808"; // Glossy obsidian pupil
  const blushColor = "#F5A894"; // Rosy peach blush cheeks
  const suctionPadColor = "#77A64C"; // Bulbous suction toe disc
  const suctionPadLight = "#A1CE72"; // Suction pad dewy shine

  // Tap interaction: Happy high leap & floating lucky clover
  const handleTap = useCallback(() => {
    Haptics.light();
    jumpY.value = withSequence(
      withTiming(-16, { duration: 110 }),
      withSpring(0, { damping: 10, stiffness: 220 })
    );
    cloverY.value = 0;
    cloverOpacity.value = 1;
    cloverY.value = withTiming(-22, { duration: 600 });
    cloverOpacity.value = withSequence(
      withTiming(1, { duration: 320 }),
      withTiming(0, { duration: 280 })
    );
  }, [jumpY, cloverY, cloverOpacity]);

  if (themeMode !== "sage") {
    return null;
  }

  return (
    <View style={[styles.container, style]} pointerEvents="box-none">
      <Canvas style={styles.canvas}>
        {/* ── 1. Realistic Multi-Layer Ground Drop Shadow ─────────────── */}
        <Group transform={shadowTransform} origin={vec(0, 0)} opacity={shadowOpacity}>
          {/* Ambient soft shadow */}
          <Path path={ambientShadowPath} color="rgba(15, 28, 8, 0.25)" style="fill" />
          {/* Core contact shadow directly under toe pads */}
          <Path path={coreShadowPath} color="rgba(15, 28, 8, 0.45)" style="fill" />
        </Group>

        {/* ── 2. Floating Lucky Clover on Tap ─────────────────────────── */}
        <Group transform={cloverTransform} origin={vec(0, 0)}>
          <Path
            path={cloverPath}
            color={colors.primary}
            opacity={cloverOpacity}
          />
        </Group>

        {/* ── 3. Realistic 2.5D Tree Frog (Turns & Leaps in 3D) ───────── */}
        <Group transform={bodyTransform} origin={vec(0, 20)}>
          {/* A. Far-side Elements (in shadow behind body) */}
          {/* Far Hind Foot */}
          <Path path={farHindFootPath} color={frogSkinFar} style="fill" />
          <Path path={farHindFootPath} color={strokeColor} style="stroke" strokeWidth={0.7} />

          {/* Far Front Leg with Suction Toe Discs */}
          <Path path={farForeLegPath} color={frogSkinFar} style="fill" />
          <Path path={farForeLegPath} color={strokeColor} style="stroke" strokeWidth={0.7} />
          <Circle cx={14.6} cy={18.2} r={1.1} color={frogSkinFar} style="fill" />
          <Circle cx={12.8} cy={18.2} r={1.1} color={frogSkinFar} style="fill" />

          {/* Far Eye Green Skin Socket (Stationary, keeps head outline solid) */}
          <Circle cx={12.2} cy={-2.5} r={3.2} color={frogSkinFar} style="fill" />
          <Circle cx={12.2} cy={-2.5} r={3.2} color={strokeColor} style="stroke" strokeWidth={0.8} />

          {/* Far Eyeball (Smoothly closes inside the socket) */}
          <Group origin={vec(12.2, -2.5)} transform={eyeTransform}>
            <Circle cx={12.2} cy={-2.5} r={2.5} color={eyeWhite} style="fill" />
            <Circle cx={12.5} cy={-2.4} r={1.6} color={pupilColor} style="fill" />
            <Circle cx={13.0} cy={-2.9} r={0.5} color="#FFFFFF" style="fill" />
          </Group>

          {/* B. Main Anatomical Frog Body (Streamlined dorsal) */}
          <Path path={frogBodyPath} color={frogSkinBack} style="fill" />

          {/* Dewy Dorsal Gloss Sheen along spine */}
          <Path path={frogBodyPath} color={frogSkinHighlight} style="stroke" strokeWidth={1.2} />

          {/* C. Creamy Ventral Throat & Belly */}
          <Path path={frogBellyPath} color={frogBelly} style="fill" />

          {/* Subtle Throat Shading Crease */}
          <Path
            path={Skia.Path.MakeFromSVGString("M 15 7.2 C 10 9, 5 10.5, 0 11.5")!}
            color="rgba(85, 126, 52, 0.25)"
            style="stroke"
            strokeWidth={0.9}
          />

          {/* D. Dorsal-Lateral Gold-Lime Accent Ridge */}
          <Path path={lateralRidgePath} color="#B5DE74" style="stroke" strokeWidth={0.95} opacity={0.65} />

          {/* E. Muscular Folded Saltatorial Hind Leg */}
          <Path path={hindThighPath} color={frogSkinBack} style="fill" />
          <Path path={hindThighPath} color={strokeColor} style="stroke" strokeWidth={0.95} />
          <Path path={hindShinPath} color={frogSkinBack} style="fill" />
          <Path path={hindShinPath} color={strokeColor} style="stroke" strokeWidth={0.85} />

          {/* Long Slender Hind Toes with Suction Pads */}
          <Path path={hindToesPath} color={strokeColor} style="stroke" strokeWidth={1.1} strokeCap="round" />
          {/* Bulbous Sticky Suction Toe Discs */}
          <Circle cx={1.1} cy={19.5} r={1.15} color={suctionPadColor} style="fill" />
          <Circle cx={1.1} cy={19.5} r={1.15} color={strokeColor} style="stroke" strokeWidth={0.6} />
          <Circle cx={1.2} cy={19.2} r={0.4} color={suctionPadLight} style="fill" />

          <Circle cx={3.7} cy={20.0} r={1.15} color={suctionPadColor} style="fill" />
          <Circle cx={3.7} cy={20.0} r={1.15} color={strokeColor} style="stroke" strokeWidth={0.6} />
          <Circle cx={3.8} cy={19.7} r={0.4} color={suctionPadLight} style="fill" />

          <Circle cx={6.7} cy={20.2} r={1.15} color={suctionPadColor} style="fill" />
          <Circle cx={6.7} cy={20.2} r={1.15} color={strokeColor} style="stroke" strokeWidth={0.6} />
          <Circle cx={6.8} cy={19.9} r={0.4} color={suctionPadLight} style="fill" />

          {/* F. Forelimb & Splayed Digits Resting on Tab Pill */}
          <Path path={foreLegPath} color={frogSkinBack} style="fill" />
          <Path path={foreLegPath} color={strokeColor} style="stroke" strokeWidth={0.85} />
          <Path path={foreDigitsPath} color={strokeColor} style="stroke" strokeWidth={1.05} strokeCap="round" />

          {/* Forefoot Suction Toe Discs */}
          <Circle cx={4.1} cy={20.5} r={1.1} color={suctionPadColor} style="fill" />
          <Circle cx={4.1} cy={20.5} r={1.1} color={strokeColor} style="stroke" strokeWidth={0.6} />

          <Circle cx={7.0} cy={20.9} r={1.1} color={suctionPadColor} style="fill" />
          <Circle cx={7.0} cy={20.9} r={1.1} color={strokeColor} style="stroke" strokeWidth={0.6} />

          <Circle cx={9.9} cy={20.6} r={1.1} color={suctionPadColor} style="fill" />
          <Circle cx={9.9} cy={20.6} r={1.1} color={strokeColor} style="stroke" strokeWidth={0.6} />

          {/* G. Fine Anatomical Silhouette Outline */}
          <Path path={frogBodyPath} color={strokeColor} style="stroke" strokeWidth={1.1} />

          {/* H. Cute Big Friendly Eye */}
          <Group origin={vec(6.8, -3.2)} transform={eyeTransform}>
            {/* Eye Sclera */}
            <Circle cx={6.8} cy={-3.2} r={4.4} color={eyeWhite} style="fill" />
            <Circle cx={6.8} cy={-3.2} r={4.4} color={strokeColor} style="stroke" strokeWidth={1.1} />

            {/* Big Glossy Obsidian Pupil */}
            <Circle cx={7.6} cy={-2.9} r={2.7} color={pupilColor} style="fill" />

            {/* Cute Double Specular Highlights */}
            <Circle cx={8.5} cy={-4.0} r={1.0} color="#FFFFFF" style="fill" />
            <Circle cx={6.5} cy={-1.8} r={0.5} color="#FFFFFF" style="fill" />
          </Group>

          {/* Rosy Peach Blush Cheek */}
          <Circle cx={8.5} cy={5.2} r={2.2} color={blushColor} opacity={0.65} />

          {/* Happy 3/4 Smiling Mouth */}
          <Path path={mouth2dPath} color={strokeColor} style="stroke" strokeWidth={0.95} strokeCap="round" />

          {/* Tiny Nostril Indent on Snout */}
          <Circle cx={15.2} cy={2.8} r={0.55} color={strokeColor} style="fill" />
        </Group>
      </Canvas>

      {/* Tap touch trigger over the 2.5D realistic frog */}
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={handleTap}
        hitSlop={{ top: 14, bottom: 6, left: 16, right: 16 }}
      />
    </View>
  );
});

export default JumpingFrog;

const styles = StyleSheet.create({
  container: {
    height: CANVAS_HEIGHT,
    width: "100%",
    position: "relative",
  },
  canvas: {
    flex: 1,
    width: "100%",
    height: CANVAS_HEIGHT,
  },
});
