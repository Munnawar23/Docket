import { AppText } from "@/components";
import { spacing } from "@/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

export const TasksListScreen = React.memo(function TasksListScreen() {
  return (
    <View style={styles.container}>
      <AppText variant="heading">Tasks</AppText>
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
  },
});
