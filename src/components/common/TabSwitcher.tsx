import { useAppTheme } from "@/hooks/useAppTheme";
import { Haptics } from "@/lib/haptics";
import type { ThemeColors } from "@/theme/colors";
import { fontSize, spacing } from "@/theme/theme";
import type { ThemeFontFamily } from "@/theme/typography";
import React, { useCallback, useEffect, useState } from "react";
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  type WithSpringConfig,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

export interface TabOption {
  label: string;
  value: string;
}

export interface TabSwitcherProps {
  tabs?: TabOption[];
  activeTab: string;
  onTabChange: (value: string) => void;
  containerStyle?: ViewStyle;
}

const SPRING_CONFIG: WithSpringConfig = {
  mass: 0.8,
  damping: 24,
  stiffness: 280,
  overshootClamping: false,
};

const DEFAULT_TABS: TabOption[] = [
  { label: "Notes", value: "notes" },
  { label: "Tasks", value: "tasks" },
];

export const TabSwitcher = React.memo<TabSwitcherProps>(function TabSwitcher({
  tabs = DEFAULT_TABS,
  activeTab,
  onTabChange,
  containerStyle,
}) {
  const { colors, fontFamily, isDark } = useAppTheme();
  const styles = createStyles(colors, fontFamily, isDark);
  const [containerWidth, setContainerWidth] = useState(0);

  const activeIndex = Math.max(
    tabs.findIndex((t) => t.value === activeTab),
    0
  );
  const tabWidth =
    containerWidth > 0
      ? (containerWidth - spacing.xs * 2) / tabs.length
      : 0;

  const translateX = useSharedValue(0);
  const startX = useSharedValue(0);
  const isDragging = useSharedValue(false);

  useEffect(() => {
    if (tabWidth > 0 && !isDragging.value) {
      translateX.value = withSpring(activeIndex * tabWidth, SPRING_CONFIG);
    }
  }, [activeIndex, tabWidth]);

  const handleTabChange = useCallback(
    (val: string) => {
      Haptics.light();
      onTabChange(val);
    },
    [onTabChange]
  );

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      "worklet";
      isDragging.value = true;
      startX.value = translateX.value;
    })
    .onUpdate((event) => {
      "worklet";
      if (tabWidth <= 0) return;
      const maxTranslate = tabWidth * (tabs.length - 1);
      const nextX = startX.value + event.translationX;
      translateX.value = Math.max(0, Math.min(nextX, maxTranslate));
    })
    .onFinalize(() => {
      "worklet";
      isDragging.value = false;
      if (tabWidth <= 0) return;
      const closestIndex = Math.round(translateX.value / tabWidth);
      const boundedIndex = Math.max(0, Math.min(closestIndex, tabs.length - 1));
      translateX.value = withSpring(boundedIndex * tabWidth, SPRING_CONFIG);
      const selectedTab = tabs[boundedIndex];
      if (selectedTab && selectedTab.value !== activeTab) {
        scheduleOnRN(handleTabChange, selectedTab.value);
      }
    });

  const animatedPillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    width: tabWidth > 0 ? tabWidth : 0,
  }));

  const onLayoutContainer = useCallback((e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  }, []);

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.track}>
        <GestureDetector gesture={panGesture}>
          <View style={styles.tabContainer} onLayout={onLayoutContainer}>
            {/* Animated Active Pill Indicator */}
            {tabWidth > 0 && (
              <Animated.View
                style={[styles.activePill, animatedPillStyle]}
              />
            )}

            {/* Tab Items */}
            {tabs.map((tab) => {
              const isActive = activeTab === tab.value;
              return (
                <Pressable
                  key={tab.value}
                  style={styles.tab}
                  hitSlop={spacing.xs}
                  onPress={() => {
                    if (!isActive) {
                      handleTabChange(tab.value);
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.tabText,
                      isActive ? styles.tabTextActive : styles.tabTextInactive,
                    ]}
                    numberOfLines={1}
                  >
                    {tab.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </GestureDetector>
      </View>
    </View>
  );
});

export default TabSwitcher;

const createStyles = (
  colors: ThemeColors,
  fontFamily: ThemeFontFamily,
  isDark: boolean
) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: spacing.screenPadding,
    },
    track: {
      borderRadius: spacing.xxl,
      overflow: "hidden",
      backgroundColor: isDark ? "#242426" : "#E4E4E6",
    },
    tabContainer: {
      flexDirection: "row",
      padding: spacing.xs,
      position: "relative",
    },
    activePill: {
      position: "absolute",
      top: spacing.xs,
      bottom: spacing.xs,
      left: spacing.xs,
      borderRadius: spacing.xl,
      backgroundColor: isDark ? "#3A3A3C" : colors.card,
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.14,
      shadowRadius: 3,
      elevation: 3,
    },
    tab: {
      flex: 1,
      paddingVertical: spacing.vSm,
      paddingHorizontal: spacing.sm,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1,
    },
    tabText: {
      textAlign: "center",
      fontSize: fontSize.body,
    },
    tabTextActive: {
      fontFamily: fontFamily.bold,
      color: colors.primary,
    },
    tabTextInactive: {
      fontFamily: fontFamily.medium,
      color: colors.subtext,
    },
  });
