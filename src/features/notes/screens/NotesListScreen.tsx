import { AppText } from "@/components";
import { useAppTheme } from "@/hooks/useAppTheme";
import type { ThemeColors } from "@/theme/colors";
import { fontSize, spacing } from "@/theme/theme";
import type { ThemeFontFamily } from "@/theme/typography";
import React from "react";
import { StyleSheet, View } from "react-native";

export const NotesListScreen = React.memo(function NotesListScreen() {
  const { colors, fontFamily } = useAppTheme();
  const styles = createStyles(colors, fontFamily);

  return (
    <View style={styles.container}>
      <AppText style={styles.text}>Notes</AppText>
    </View>
  );
});

export default NotesListScreen;

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
