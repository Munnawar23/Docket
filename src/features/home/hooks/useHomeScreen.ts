import { Haptics } from "@/lib/haptics";
import { useCallback, useMemo, useState } from "react";
import { Dimensions, LayoutChangeEvent } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  type WithSpringConfig,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, verticalScale } from "@/helpers/responsiveHelper";
import { scheduleOnRN, scheduleOnUI } from "react-native-worklets";

export type HomeTab = "notes" | "tasks";

export const HOME_TABS = [
  { label: "Notes", value: "notes" },
  { label: "Tasks", value: "tasks" },
];

const SCREEN_WIDTH = Dimensions.get("window").width;

const PAGE_SPRING_CONFIG: WithSpringConfig = {
  mass: 0.8,
  damping: 26,
  stiffness: 240,
  overshootClamping: false,
};

const TITLE_OFFSET = scale(30);

export function useHomeScreen() {
  const [activeTab, setActiveTab] = useState<HomeTab>("notes");
  const insets = useSafeAreaInsets();

  // Keep pageWidth on the UI thread — gesture handlers read it without bridging
  const pageWidth = useSharedValue(SCREEN_WIDTH);
  const contentTranslateX = useSharedValue(0);
  const startTranslateX = useSharedValue(0);

  const handleSwipeTabChange = useCallback((newTab: HomeTab) => {
    Haptics.light();
    setActiveTab(newTab);
  }, []);

  const swipeGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-15, 15])
        .failOffsetY([-15, 15])
        .onBegin(() => {
          "worklet";
          startTranslateX.value = contentTranslateX.value;
        })
        .onUpdate((event) => {
          "worklet";
          const w = pageWidth.value;
          if (w <= 0) return;
          const raw = startTranslateX.value + event.translationX;
          if (raw > 0) {
            contentTranslateX.value = raw * 0.2;
          } else if (raw < -w) {
            contentTranslateX.value = -w + (raw + w) * 0.2;
          } else {
            contentTranslateX.value = raw;
          }
        })
        .onFinalize((event) => {
          "worklet";
          const w = pageWidth.value;
          if (w <= 0) return;
          const progress = -contentTranslateX.value / w;
          let targetIndex = Math.round(progress);
          if (event.velocityX < -400) targetIndex = 1;
          else if (event.velocityX > 400) targetIndex = 0;
          targetIndex = Math.max(0, Math.min(1, targetIndex));
          contentTranslateX.value = withSpring(-targetIndex * w, PAGE_SPRING_CONFIG);
          const newTab: HomeTab = targetIndex === 0 ? "notes" : "tasks";
          scheduleOnRN(handleSwipeTabChange, newTab);
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] // shared values are stable refs — safe to omit
  );

  // Tab-bar press: run entirely on UI thread to avoid reading .value on JS thread
  const handleTabPress = (val: HomeTab) => {
    const targetIndex = val === "notes" ? 0 : 1;
    scheduleOnUI(() => {
      "worklet";
      contentTranslateX.value = withSpring(
        -targetIndex * pageWidth.value,
        PAGE_SPRING_CONFIG
      );
    });
    setActiveTab(val);
  };

  const onContentLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w <= 0) return;
    const snapIndex = activeTab === "tasks" ? 1 : 0;
    scheduleOnUI(() => {
      "worklet";
      if (w === pageWidth.value) return;
      pageWidth.value = w;
      // Snap to current tab position without animation on layout change
      contentTranslateX.value = -snapIndex * w;
    });
  };

  const animatedPageStyle = useAnimatedStyle(() => ({
    width: pageWidth.value * 2,
    transform: [{ translateX: contentTranslateX.value }],
  }));

  const notesTitleStyle = useAnimatedStyle(() => {
    const progress = -contentTranslateX.value / (pageWidth.value || 1);
    return {
      opacity: interpolate(progress, [0, 0.45, 1], [1, 0, 0], Extrapolation.CLAMP),
      transform: [
        { translateX: interpolate(progress, [0, 1], [0, -TITLE_OFFSET], Extrapolation.CLAMP) },
      ],
    };
  });

  const tasksTitleStyle = useAnimatedStyle(() => {
    const progress = -contentTranslateX.value / (pageWidth.value || 1);
    return {
      opacity: interpolate(progress, [0, 0.55, 1], [0, 0, 1], Extrapolation.CLAMP),
      transform: [
        { translateX: interpolate(progress, [0, 1], [TITLE_OFFSET, 0], Extrapolation.CLAMP) },
      ],
    };
  });

  const floatingBottom = Math.max(insets.bottom, verticalScale(16)) + verticalScale(22);

  return {
    activeTab,
    swipeGesture,
    handleTabPress,
    onContentLayout,
    animatedPageStyle,
    notesTitleStyle,
    tasksTitleStyle,
    insets,
    floatingBottom,
  };
}
