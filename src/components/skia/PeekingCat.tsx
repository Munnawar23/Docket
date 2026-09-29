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
  type SharedValue,
} from "react-native-reanimated";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Haptics } from "@/lib/haptics";
import { scale, verticalScale } from "@/helpers/responsiveHelper";

export interface PeekingCatProps {
  /** Animated translateX of the active tab pill */
  activeX?: SharedValue<number>;
  /** Width of a single tab option */
  tabWidth?: number;
  /** Total container width */
  containerWidth?: number;
  style?: StyleProp<ViewStyle>;
}

const CANVAS_HEIGHT = verticalScale(34);

export const PeekingCat = React.memo(function PeekingCat({
  activeX,
  tabWidth = 0,
  containerWidth = scale(190),
  style,
}: PeekingCatProps) {
  const { colors, themeMode } = useAppTheme();

  // 1. Shared values for 120 FPS UI thread animations
  const catX = useSharedValue(containerWidth / 2);
  const idleTime = useSharedValue(0);
  const blinkTimer = useSharedValue(0);
  const duckY = useSharedValue(0);
  const heartOpacity = useSharedValue(0);
  const heartY = useSharedValue(0);

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

    // Smooth fluid glide to follow active tab
    catX.value += (targetX - catX.value) * Math.min(1, dt * 10);
  });

  // 3. UNIFIED ONE-PIECE HEAD + EARS (Ears are 100% physically connected to the skull)
  const unifiedCatHeadPath = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        "M -11 21 C -14 18, -14 10, -10 6 L -10 -7 L -3 3 C -1 2.2, 1 2.2, 3 3 L 10 -7 L 10 6 C 14 10, 14 18, 11 21 C 7 23, -7 23, -11 21 Z"
      )!,
    []
  );

  // Left Inner Ear (Pink triangle nestled inside left ear)
  const leftInnerEarPath = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        "M -9 5 L -9 -4 L -3.5 2.5 Z"
      )!,
    []
  );

  // Right Inner Ear (Pink triangle nestled inside right ear)
  const rightInnerEarPath = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        "M 3.5 2.5 L 9 -4 L 9 5 Z"
      )!,
    []
  );

  // Calico forehead patch
  const foreheadPatchPath = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        "M -3.5 4 C -1 2.5, 2 2.5, 4 4.5 C 2 7.5, -2 7.5, -3.5 4 Z"
      )!,
    []
  );

  // Feline :3 mouth
  const mouthPath = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        "M -2.2 17.5 Q -1.1 18.8 0 18 Q 1.1 18.8 2.2 17.5"
      )!,
    []
  );

  // Cat paw resting on the rim
  const pawPath = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        "M -4 0 C -4 -2.8, 4 -2.8, 4 0 C 4 2.8, -4 2.8, -4 0 Z"
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

  // 4. UI Thread Animations (Whole cat head bobs together naturally)
  const headTransform = useDerivedValue(() => {
    const breathY = Math.sin(idleTime.value * 2.4) * 0.7;

    return [
      { translateX: catX.value },
      { translateY: 9 + breathY + duckY.value },
    ];
  });

  // Natural cat blink
  const eyeScaleY = useDerivedValue(() => {
    const cycle = blinkTimer.value % 3.6;
    if (cycle > 3.45) {
      return 0.1;
    }
    return 1.0;
  });

  const leftEyeTransform = useDerivedValue(() => [
    { scaleY: eyeScaleY.value },
  ]);

  const rightEyeTransform = useDerivedValue(() => [
    { scaleY: eyeScaleY.value },
  ]);

  const heartTransform = useDerivedValue(() => [
    { translateX: catX.value },
    { translateY: -6 + heartY.value },
    { scale: heartOpacity.value },
  ]);

  // 5. Aesthetic theme colors
  const furColor = "#FFFDF9";
  const strokeColor = "rgba(44, 30, 26, 0.9)";
  const eyeColor = "#221512";
  const pinkInner = "#FFB6C6";
  const nosePink = "#FF6B8B";

  const patchColor = "#FFCAD6";

  // Tap interaction
  const handleTap = useCallback(() => {
    Haptics.light();
    duckY.value = withSequence(
      withTiming(5, { duration: 90 }),
      withSpring(0, { damping: 12, stiffness: 220 })
    );
    heartY.value = 0;
    heartOpacity.value = 1;
    heartY.value = withTiming(-16, { duration: 600 });
    heartOpacity.value = withSequence(
      withTiming(1, { duration: 320 }),
      withTiming(0, { duration: 280 })
    );
  }, [duckY, heartY, heartOpacity]);

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

        {/* The Cat Head & Hands (Whole unit bobs together) */}
        <Group transform={headTransform} origin={vec(0, 12)}>
          {/* 1. CONTINUOUS UNIFIED CAT HEAD + EARS SILHOUETTE */}
          <Path
            path={unifiedCatHeadPath}
            color={furColor}
            style="fill"
          />

          {/* Forehead Calico Patch */}
          <Path
            path={foreheadPatchPath}
            color={patchColor}
            style="fill"
          />

          {/* Left Inner Ear (Pink) */}
          <Path
            path={leftInnerEarPath}
            color={pinkInner}
            style="fill"
          />

          {/* Right Inner Ear (Pink) */}
          <Path
            path={rightInnerEarPath}
            color={pinkInner}
            style="fill"
          />

          {/* Crisp Head + Ears Seamless Outline */}
          <Path
            path={unifiedCatHeadPath}
            color={strokeColor}
            style="stroke"
            strokeWidth={1.2}
          />

          {/* 2. Soft Rosy Blush Cheeks */}
          <Circle
            cx={-6.8}
            cy={15}
            r={1.8}
            color={pinkInner}
            opacity={0.65}
          />
          <Circle
            cx={6.8}
            cy={15}
            r={1.8}
            color={pinkInner}
            opacity={0.65}
          />

          {/* 3. Curious Cat Eyes */}
          <Group origin={vec(-4.5, 12)} transform={leftEyeTransform}>
            <Circle
              cx={-4.5}
              cy={12}
              r={2.4}
              color={eyeColor}
              style="fill"
            />
            <Circle
              cx={-3.8}
              cy={11.3}
              r={0.8}
              color="#FFFFFF"
              style="fill"
            />
          </Group>

          <Group origin={vec(4.5, 12)} transform={rightEyeTransform}>
            <Circle
              cx={4.5}
              cy={12}
              r={2.4}
              color={eyeColor}
              style="fill"
            />
            <Circle
              cx={5.2}
              cy={11.3}
              r={0.8}
              color="#FFFFFF"
              style="fill"
            />
          </Group>

          {/* 4. Tiny Pink Cat Nose */}
          <Circle
            cx={0}
            cy={14.8}
            r={0.9}
            color={nosePink}
            style="fill"
          />

          {/* 5. Cute :3 Mouth */}
          <Path
            path={mouthPath}
            color={strokeColor}
            style="stroke"
            strokeWidth={0.85}
            strokeCap="round"
          />

          {/* 6. Thin Whiskers */}
          <Line
            p1={vec(-6.5, 15)}
            p2={vec(-14, 14)}
            color={strokeColor}
            strokeWidth={0.8}
          />
          <Line
            p1={vec(-6.5, 16.5)}
            p2={vec(-13, 17.5)}
            color={strokeColor}
            strokeWidth={0.8}
          />
          <Line
            p1={vec(6.5, 15)}
            p2={vec(14, 14)}
            color={strokeColor}
            strokeWidth={0.8}
          />
          <Line
            p1={vec(6.5, 16.5)}
            p2={vec(13, 17.5)}
            color={strokeColor}
            strokeWidth={0.8}
          />

          {/* 7. TWO CAT PAWS / HANDS VISIBLY RESTING ON THE RIM */}
          {/* Left Cat Hand */}
          <Group transform={[{ translateX: -11.5 }, { translateY: 21.5 }]}>
            <Path
              path={pawPath}
              color={furColor}
              style="fill"
            />
            <Path
              path={pawPath}
              color={strokeColor}
              style="stroke"
              strokeWidth={1.1}
            />
            {/* Kitten Toe Lines */}
            <Line
              p1={vec(-1.2, -1.8)}
              p2={vec(-1.2, 1.8)}
              color={strokeColor}
              strokeWidth={0.8}
            />
            <Line
              p1={vec(1.2, -1.8)}
              p2={vec(1.2, 1.8)}
              color={strokeColor}
              strokeWidth={0.8}
            />
          </Group>

          {/* Right Cat Hand */}
          <Group transform={[{ translateX: 11.5 }, { translateY: 21.5 }]}>
            <Path
              path={pawPath}
              color={furColor}
              style="fill"
            />
            <Path
              path={pawPath}
              color={strokeColor}
              style="stroke"
              strokeWidth={1.1}
            />
            {/* Kitten Toe Lines */}
            <Line
              p1={vec(-1.2, -1.8)}
              p2={vec(-1.2, 1.8)}
              color={strokeColor}
              strokeWidth={0.8}
            />
            <Line
              p1={vec(1.2, -1.8)}
              p2={vec(1.2, 1.8)}
              color={strokeColor}
              strokeWidth={0.8}
            />
          </Group>
        </Group>
      </Canvas>

      {/* Tap touch trigger over the peeking cat */}
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={handleTap}
        hitSlop={{ top: 12, bottom: 6, left: 16, right: 16 }}
      />
    </View>
  );
});

export default PeekingCat;

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
