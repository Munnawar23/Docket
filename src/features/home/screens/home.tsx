import { ThemeBackground } from "@/components";
import NotesListScreen from "@/features/notes/screens/NotesListScreen";
import TasksListScreen from "@/features/tasks/screens/TasksListScreen";
import { useAppTheme } from "@/hooks/useAppTheme";
import { fontSize, spacing, type ThemeColors, type ThemeFontFamily } from "@/theme";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import BottomBar from "../components/BottomBar";
import Header from "../components/Header";
import { HOME_TABS, type HomeTab, useHomeScreen } from "../hooks";

export type { HomeTab };

export function HomeScreen() {
  const { colors, fontFamily } = useAppTheme();
  const styles = useMemo(() => createStyles(colors, fontFamily), [colors, fontFamily]);

  const {
    activeTab,
    swipeGesture,
    handleTabPress,
    onContentLayout,
    animatedPageStyle,
    notesTitleStyle,
    tasksTitleStyle,
    insets,
    floatingBottom,
  } = useHomeScreen();

  return (
    <ThemeBackground style={styles.container}>
      <View style={[styles.safeArea, { paddingTop: insets.top }]}>
        {/* Top Header: Drawer Toggle + SearchBar + Profile */}
        <Header />

        {/* Large Page Title with synchronized horizontal slide */}
        <View style={styles.titleContainer}>
          <Animated.Text style={[styles.largeTitle, notesTitleStyle]}>
            Notes
          </Animated.Text>
          <Animated.Text style={[styles.largeTitle, styles.absoluteTitle, tasksTitleStyle]}>
            Tasks
          </Animated.Text>
        </View>

        {/* Tab Content Body (Swipeable & Animated Sliding Pages) */}
        <GestureDetector gesture={swipeGesture}>
          <View style={styles.contentContainer} onLayout={onContentLayout}>
            <Animated.View style={[styles.pageStrip, animatedPageStyle]}>
              <View style={styles.pageWrapper}>
                <NotesListScreen />
              </View>
              <View style={styles.pageWrapper}>
                <TasksListScreen />
              </View>
            </Animated.View>
          </View>
        </GestureDetector>
      </View>

      {/* Unified Floating Bottom Bar (TabSwitcher + Inline FAB Button) */}
      <BottomBar
        tabs={HOME_TABS}
        activeTab={activeTab}
        onTabChange={(val) => handleTabPress(val as HomeTab)}
        bottomOffset={floatingBottom}
      />
    </ThemeBackground>
  );
}

export default HomeScreen;

const createStyles = (colors: ThemeColors, fontFamily: ThemeFontFamily) =>
  StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1 },
    titleContainer: {
      paddingHorizontal: spacing.screenPadding,
      paddingTop: spacing.vXs,
      paddingBottom: spacing.vXs,
      position: "relative",
      justifyContent: "center",
    },
    largeTitle: {
      fontSize: fontSize.heading + 10,
      letterSpacing: -0.5,
      color: colors.text,
      fontFamily: fontFamily.heading,
    },
    absoluteTitle: {
      position: "absolute",
      left: spacing.screenPadding,
    },
    contentContainer: {
      flex: 1,
      overflow: "hidden",
    },
    pageStrip: {
      flex: 1,
      flexDirection: "row",
    },
    pageWrapper: { flex: 1 },
  });
