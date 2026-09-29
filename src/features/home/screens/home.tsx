import { AnimatedAppText } from "@/components";
import NotesListScreen from "@/features/notes/screens/NotesListScreen";
import TasksListScreen from "@/features/tasks/screens/TasksListScreen";
import { useAppTheme } from "@/hooks/useAppTheme";
import { spacing, type ThemeColors, type ThemeFontFamily } from "@/theme";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import BottomBar from "../components/BottomBar";
import Header from "../components/Header";
import { HOME_TABS, type HomeTab, useHomeScreen } from "../hooks";

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
    floatingBottom,
  } = useHomeScreen();

  return (
    <View style={styles.container}>
      {/* Top Header: Drawer Toggle + SearchBar + Profile (Handles Top Safe Area) */}
      <Header />

      {/* Large Page Title with synchronized horizontal slide */}
      <View style={styles.titleContainer}>
        <AnimatedAppText
          variant="largeTitle"
          style={notesTitleStyle}
        >
          Notes
        </AnimatedAppText>
        <AnimatedAppText
          variant="largeTitle"
          style={[styles.absoluteTitle, tasksTitleStyle]}
        >
          Tasks
        </AnimatedAppText>
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

      {/* Unified Floating Bottom Bar (TabSwitcher + Inline FAB Button) */}
      <BottomBar
        tabs={HOME_TABS}
        activeTab={activeTab}
        onTabChange={(val) => handleTabPress(val as HomeTab)}
        bottomOffset={floatingBottom}
      />
    </View>
  );
}

export default HomeScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────

const createStyles = (colors: ThemeColors, fontFamily: ThemeFontFamily) =>
  StyleSheet.create({
    container: { flex: 1 },
    titleContainer: {
      paddingHorizontal: spacing.screenPadding,
      paddingTop: spacing.vXs,
      paddingBottom: spacing.vXs,
      position: "relative",
      justifyContent: "center",
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
