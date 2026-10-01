import { AppText, EmptyState } from "@/components";
import { useAppSafeArea } from "@/hooks/useAppSafeArea";
import { useAppTheme } from "@/hooks/useAppTheme";
import { spacing, type ThemeSpacing } from "@/theme";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const BOTTOM_BAR_CLEARANCE = spacing.xxxl * 3 + spacing.lg;

export const TasksListScreen = React.memo(function TasksListScreen() {
  const { colors } = useAppTheme();
  const { bottom } = useAppSafeArea();

  const styles = useMemo(() => createStyles(spacing), []);

  const bottomPadding = Math.max(bottom, spacing.screenPadding) + BOTTOM_BAR_CLEARANCE;

  const contentContainerStyle = useMemo(
    () => [styles.scrollContent, { paddingBottom: bottomPadding }],
    [styles.scrollContent, bottomPadding],
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleContainer}>
          <AppText variant="largeTitle">Tasks</AppText>
        </View>
        <View style={styles.emptyContainer}>
          <EmptyState
            iconFamily="Ionicons"
            iconName="checkbox-outline"
            iconColor={colors.primary}
            title="No tasks yet"
            description="Stay organized and get things done."
          />
        </View>
      </ScrollView>
    </View>
  );
});

export default TasksListScreen;

const createStyles = (spacing: ThemeSpacing) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: spacing.screenPadding,
      paddingTop: spacing.sm,
    },
    titleContainer: {
      paddingTop: spacing.vXs,
      paddingBottom: spacing.sm,
    },
    emptyContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingTop: spacing.xxxl * 2,
      paddingBottom: spacing.xxxl * 2,
    },
  });
