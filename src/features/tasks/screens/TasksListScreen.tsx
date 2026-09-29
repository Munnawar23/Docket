import { EmptyState } from "@/components";
import { useAppTheme } from "@/hooks/useAppTheme";
import { verticalScale } from "@/helpers/responsiveHelper";
import { spacing } from "@/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

export const TasksListScreen = React.memo(function TasksListScreen() {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      <EmptyState
        iconFamily="Ionicons"
        iconName="checkbox-outline"
        iconColor={colors.primary}
        title="No tasks yet"
        description="Stay organized and get things done."
      />
    </View>
  );
});

export default TasksListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: verticalScale(85),
  },
});
