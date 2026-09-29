import React, { useCallback, useEffect, useMemo } from "react";
import { StyleSheet, View, Pressable, type StyleProp, type ViewStyle } from "react-native";
import {
  Canvas,
  Circle,
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
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Haptics } from "@/lib/haptics";
import { scale, verticalScale } from "@/helpers/responsiveHelper";

export interface WalkingCatProps {
  /** Width of the search bar track in pixels */
  barWidth?: number;
  /** Whether the search bar is currently focused (cat sits & observes) */
  isFocused?: boolean;
  style?: StyleProp<ViewStyle>;
}

const CANVAS_HEIGHT = verticalScale(38);

export const WalkingCat = React.memo(function WalkingCat({
  barWidth = 280,
  isFocused = false,
  style,
}: WalkingCatProps) {
  const { colors, themeMode } = useAppTheme();

  // 1. Shared values for 120 FPS UI thread animations
  const catX = useSharedValue(24);
  const direction = useSharedValue(1); // 1 = walking right, -1 = walking left
  const turnScale = useSharedValue(1);
  const stepCycle = useSharedValue(0);
  const idleTime = useSharedValue(0);
  const sitProgress = useSharedValue(0);
  const jumpY = useSharedValue(0);
  const heartOpacity = useSharedValue(0);
  const heartY = useSharedValue(0);

  const barWidthShared = useSharedValue(barWidth > 0 ? barWidth : 280);
  const focusedShared = useSharedValue(isFocused);

  useEffect(() => {
    if (barWidth > 0) {
      barWidthShared.value = barWidth;
    }
  }, [barWidth, barWidthShared]);

  useEffect(() => {
    focusedShared.value = isFocused;
  }, [isFocused, focusedShared]);

  // 2. 120 FPS UI Thread Frame Loop (Natural 4-Beat Cat Walk)
  useFrameCallback((frameInfo) => {
    "worklet";
    if (!frameInfo.timeSincePreviousFrame) return;

    const dt = Math.min(frameInfo.timeSincePreviousFrame / 1000, 0.05);

    // Smoothly blend sitting vs walking with delta time (no animation timer restarts)
    if (focusedShared.value) {
      sitProgress.value = Math.min(1, sitProgress.value + dt * 4.5);
      idleTime.value += dt;
      // Smooth turn interpolation even when sitting
      turnScale.value += (direction.value - turnScale.value) * Math.min(1, dt * 14);
      return;
    } else {
      sitProgress.value = Math.max(0, sitProgress.value - dt * 4.5);
    }

    // Realistic cat walk speed and cadence (calm, cute padding rhythm)
    const walkSpeed = 22;
    const cadence = 4.8; // ~0.76 full walk cycles per second

    stepCycle.value += dt * cadence;

    const currentX = catX.value;
    const dir = direction.value;
    const minX = 20;
    const maxX = Math.max(minX + 40, barWidthShared.value - 20);

    let nextX = currentX + dir * walkSpeed * dt;

    if (dir > 0 && nextX >= maxX) {
      nextX = maxX;
      direction.value = -1;
    } else if (dir < 0 && nextX <= minX) {
      nextX = minX;
      direction.value = 1;
    }

    // Smooth turn flip towards current direction
    turnScale.value += (direction.value - turnScale.value) * Math.min(1, dt * 14);

    catX.value = nextX;
  });

  // 3. Crisp Vector Shapes
  // Torso / Back (Natural feline curves: arched back, soft belly, rounded rump)
  const bodyPath = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        "M -12 1 C -12 -5, -6 -6.5, 2 -5.5 C 7 -5, 10 -2, 10 3 C 10 7, 6 7.5, 0 7.5 C -7 7.5, -12 6, -12 1 Z"
      )!,
    []
  );

  // Tabby Calico Patch on back
  const backPatchPath = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        "M -7 -4 C -3 -6, 2 -5.5, 5 -3.5 C 3 -1, -1 -1, -4 -2 C -6 -3, -7 -3.5, -7 -4 Z"
      )!,
    []
  );

  // Iconic curved cat tail
  const tailPath = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        "M -11 0 C -16 -2, -18 -8, -15 -14 C -14 -16, -10 -15, -11 -12 C -13 -8, -11 -4, -8 0 Z"
      )!,
    []
  );

  const tailTipPath = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        "M -15 -14 C -14 -16, -10 -15, -11 -12 C -12.5 -10, -14 -11, -15 -14 Z"
      )!,
    []
  );

  // Pointy Near Ear (Front)
  const nearEarPath = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        "M 8 -10 L 13 -8 L 12 -16 Z"
      )!,
    []
  );

  const nearInnerEarPath = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        "M 9 -10 L 12.5 -8.5 L 11.8 -14.5 Z"
      )!,
    []
  );

  // Pointy Far Ear (Back with depth)
  const farEarPath = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        "M 4 -9 L 8 -10 L 5 -15 Z"
      )!,
    []
  );

  const farInnerEarPath = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        "M 4.8 -9.2 L 7.5 -10 L 5.5 -13.8 Z"
      )!,
    []
  );

  // Slender Cat Leg with rounded paw (starts at 0,0, hangs down to 7.5px)
  const legPath = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        "M -1.4 0 L -1.2 5.5 C -1.2 7.2, 1.2 7.2, 1.2 5.5 L 1.4 0 Z"
      )!,
    []
  );

  // Head patch over one eye (calico marking)
  const headPatchPath = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        "M 6 -11 C 9 -12, 13 -10, 14 -7 C 13 -5, 10 -6, 7 -7 Z"
      )!,
    []
  );

  // Muzzle & Mouth curve
  const mouthPath = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        "M 14.5 -2.5 Q 15.5 -1.8 16.5 -2.5"
      )!,
    []
  );

  // Floating Heart on tap
  const heartPath = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        "M 0 2 C -3 -2, -6 -1, -6 2 C -6 5, 0 8, 0 10 C 0 8, 6 5, 6 2 C 6 -1, 3 -2, 0 2 Z"
      )!,
    []
  );

  // 4. Harmonic UI Thread Animations (Pendulum hip pivots with natural paw lift)
  const maxSwing = 0.35; // ~20 degrees max natural swing

  // Front-Right Leg (Foreground)
  const frontLeg1Transform = useDerivedValue(() => {
    if (sitProgress.value > 0.5) {
      return [{ translateX: 7 }, { translateY: 3.5 }, { rotate: 0.08 }];
    }
    const sinP = Math.sin(stepCycle.value);
    const angle = sinP * maxSwing;
    // Lift paw slightly off the ground when swinging forward
    const liftY = Math.max(0, sinP) * -2.0;
    return [{ translateX: 7 }, { translateY: 3.5 + liftY }, { rotate: angle }];
  });

  // Front-Left Leg (Background / Shadow - diagonal counter-phase)
  const frontLeg2Transform = useDerivedValue(() => {
    if (sitProgress.value > 0.5) {
      return [{ translateX: 5.5 }, { translateY: 3.0 }, { rotate: -0.05 }];
    }
    const sinP = Math.sin(stepCycle.value + Math.PI);
    const angle = sinP * maxSwing;
    const liftY = Math.max(0, sinP) * -2.0;
    return [{ translateX: 5.5 }, { translateY: 3.0 + liftY }, { rotate: angle }];
  });

  // Back-Right Leg (Foreground)
  const backLeg1Transform = useDerivedValue(() => {
    if (sitProgress.value > 0.5) {
      return [{ translateX: -6.5 }, { translateY: 3.5 }, { rotate: -0.25 }];
    }
    const sinP = Math.sin(stepCycle.value + Math.PI + 0.25);
    const angle = sinP * maxSwing;
    const liftY = Math.max(0, sinP) * -2.0;
    return [{ translateX: -6.5 }, { translateY: 3.5 + liftY }, { rotate: angle }];
  });

  // Back-Left Leg (Background / Shadow)
  const backLeg2Transform = useDerivedValue(() => {
    if (sitProgress.value > 0.5) {
      return [{ translateX: -8.0 }, { translateY: 3.0 }, { rotate: -0.20 }];
    }
    const sinP = Math.sin(stepCycle.value + 0.25);
    const angle = sinP * maxSwing;
    const liftY = Math.max(0, sinP) * -2.0;
    return [{ translateX: -8.0 }, { translateY: 3.0 + liftY }, { rotate: angle }];
  });

  // Body bouncy trot
  const catGroupTransform = useDerivedValue(() => {
    const sitY = sitProgress.value * 2;
    const bounceY =
      (1 - sitProgress.value) *
      Math.abs(Math.sin(stepCycle.value * 2)) *
      0.9;

    return [
      { translateX: catX.value },
      { translateY: 21 + sitY - bounceY + jumpY.value },
      { scaleX: turnScale.value },
    ];
  });

  // Soft tail sway
  const tailTransform = useDerivedValue(() => {
    if (sitProgress.value > 0.5) {
      const curl = Math.sin(idleTime.value * 3) * 0.22 - 0.12;
      return [{ rotate: curl }];
    }
    const sway = Math.sin(stepCycle.value) * 0.25;
    return [{ rotate: sway }];
  });

  // Head bob
  const headTransform = useDerivedValue(() => {
    if (sitProgress.value > 0.5) {
      const tilt = Math.sin(idleTime.value * 2) * 0.06;
      return [{ rotate: tilt }, { translateY: -0.8 }];
    }
    const bob = Math.cos(stepCycle.value * 2) * 0.45;
    return [{ translateY: bob }];
  });

  const heartTransform = useDerivedValue(() => [
    { translateX: catX.value + 6 },
    { translateY: 4 + heartY.value },
    { scale: heartOpacity.value },
  ]);

  // 5. Aesthetic theme colors
  const furColor = "#FFFDF9";
  const furShadow = "#ECE6DF";
  const strokeColor = "rgba(48, 34, 30, 0.88)";
  const eyeColor = "#221512";
  const pinkCheek = "#FFB6C6";
  const nosePink = "#FF6B8B";

  const patchColor = "#FFCAD6";

  // Tap interaction: cute hop & meow heart
  const handleTap = useCallback(() => {
    Haptics.light();
    jumpY.value = withSequence(
      withTiming(-9, { duration: 120 }),
      withSpring(0, { damping: 12, stiffness: 220 })
    );
    heartY.value = 0;
    heartOpacity.value = 1;
    heartY.value = withTiming(-18, { duration: 650 });
    heartOpacity.value = withSequence(
      withTiming(1, { duration: 350 }),
      withTiming(0, { duration: 300 })
    );
  }, [jumpY, heartY, heartOpacity]);

  if (themeMode !== "rose") {
    return null;
  }

  return (
    <View style={[styles.container, style]} pointerEvents="box-none">
      <Canvas style={styles.canvas}>
        {/* Floating Heart on Tap */}
        <Group transform={heartTransform} origin={vec(0, 5)}>
          <Path
            path={heartPath}
            color={colors.primary}
            opacity={heartOpacity}
          />
        </Group>

        {/* The Animated Walking Cat */}
        <Group transform={catGroupTransform} origin={vec(0, 0)}>
          {/* 1. Far-side legs (Shadow layer for 3D depth, hinged at shoulder/hip) */}
          <Group transform={backLeg2Transform} origin={vec(0, 0)}>
            <Path
              path={legPath}
              color={furShadow}
              style="fill"
            />
            <Path
              path={legPath}
              color={strokeColor}
              style="stroke"
              strokeWidth={1}
            />
          </Group>
          <Group transform={frontLeg2Transform} origin={vec(0, 0)}>
            <Path
              path={legPath}
              color={furShadow}
              style="fill"
            />
            <Path
              path={legPath}
              color={strokeColor}
              style="stroke"
              strokeWidth={1}
            />
          </Group>

          {/* 2. S-Curved Tail */}
          <Group origin={vec(-11, 0)} transform={tailTransform}>
            <Path
              path={tailPath}
              color={furColor}
              style="fill"
            />
            <Path
              path={tailTipPath}
              color={patchColor}
              style="fill"
            />
            <Path
              path={tailPath}
              color={strokeColor}
              style="stroke"
              strokeWidth={1.2}
            />
          </Group>

          {/* 3. Main Torso (Smooth continuous feline body) */}
          <Path
            path={bodyPath}
            color={furColor}
            style="fill"
          />
          {/* Calico Patch on back */}
          <Path
            path={backPatchPath}
            color={patchColor}
            style="fill"
          />
          <Path
            path={bodyPath}
            color={strokeColor}
            style="stroke"
            strokeWidth={1.2}
          />

          {/* 4. Near-side legs (Foreground, hinged at shoulder/hip with paw lift) */}
          <Group transform={backLeg1Transform} origin={vec(0, 0)}>
            <Path
              path={legPath}
              color={furColor}
              style="fill"
            />
            <Path
              path={legPath}
              color={strokeColor}
              style="stroke"
              strokeWidth={1.1}
            />
          </Group>
          <Group transform={frontLeg1Transform} origin={vec(0, 0)}>
            <Path
              path={legPath}
              color={furColor}
              style="fill"
            />
            <Path
              path={legPath}
              color={strokeColor}
              style="stroke"
              strokeWidth={1.1}
            />
          </Group>

          {/* 5. Head Group (Cleanly anchored at neck/shoulders) */}
          <Group origin={vec(10, -5)} transform={headTransform}>
            {/* Far Ear (Behind head) */}
            <Path
              path={farEarPath}
              color={furColor}
              style="fill"
            />
            <Path
              path={farInnerEarPath}
              color={pinkCheek}
              style="fill"
            />
            <Path
              path={farEarPath}
              color={strokeColor}
              style="stroke"
              strokeWidth={1.1}
            />

            {/* Head Sphere */}
            <Circle
              cx={10}
              cy={-5}
              r={6.8}
              color={furColor}
              style="fill"
            />
            {/* Calico forehead patch */}
            <Path
              path={headPatchPath}
              color={patchColor}
              style="fill"
            />
            <Circle
              cx={10}
              cy={-5}
              r={6.8}
              color={strokeColor}
              style="stroke"
              strokeWidth={1.2}
            />

            {/* Near Ear (In front) */}
            <Path
              path={nearEarPath}
              color={furColor}
              style="fill"
            />
            <Path
              path={nearInnerEarPath}
              color={pinkCheek}
              style="fill"
            />
            <Path
              path={nearEarPath}
              color={strokeColor}
              style="stroke"
              strokeWidth={1.1}
            />

            {/* Rosy Cheek Blush */}
            <Circle
              cx={12.5}
              cy={-2.2}
              r={1.8}
              color={pinkCheek}
              opacity={0.65}
            />

            {/* Anime Kawaii Eye with white twinkle highlight */}
            <Circle
              cx={12.8}
              cy={-5.5}
              r={1.5}
              color={eyeColor}
              style="fill"
            />
            <Circle
              cx={13.3}
              cy={-5.9}
              r={0.55}
              color="#FFFFFF"
              style="fill"
            />

            {/* Tiny Pink Cat Nose */}
            <Circle
              cx={16.2}
              cy={-3.8}
              r={0.9}
              color={nosePink}
              style="fill"
            />

            {/* Cute Cat Mouth */}
            <Path
              path={mouthPath}
              color={strokeColor}
              style="stroke"
              strokeWidth={0.9}
              strokeCap="round"
            />

            {/* Whiskers extending from snout */}
            <Line
              p1={vec(15.5, -3.5)}
              p2={vec(21.5, -5)}
              color={strokeColor}
              strokeWidth={0.8}
            />
            <Line
              p1={vec(15.5, -2.5)}
              p2={vec(21.5, 0.5)}
              color={strokeColor}
              strokeWidth={0.8}
            />
          </Group>
        </Group>
      </Canvas>

      {/* Transparent touch area for tapping the cat */}
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={handleTap}
        hitSlop={{ top: 10, bottom: 5, left: 10, right: 10 }}
      />
    </View>
  );
});

export default WalkingCat;

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
