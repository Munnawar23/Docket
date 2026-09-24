import { AppText } from "@/components";
import { useAppTheme } from "@/hooks/useAppTheme";
import { fontSize, spacing, type ThemeColors, type ThemeFontFamily } from "@/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

export const TasksListScreen = React.memo(function TasksListScreen() {
  const { colors, fontFamily } = useAppTheme();
  const styles = createStyles(colors, fontFamily);

  return (
    <View style={styles.container}>
      <AppText style={styles.text}>Tasks</AppText>
    </View>
  );
});

export default TasksListScreen;

const createStyles = (colors: ThemeColors, fontFamily: ThemeFontFamily) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: spacing.screenPadding,
    },
    text: {
      fontSize: fontSize.heading,
      color: colors.text,
      fontFamily: fontFamily.heading,
    },
  });
