import { EmptyState } from "@/components";
import { useAppTheme } from "@/hooks/useAppTheme";
import { verticalScale } from "@/helpers/responsiveHelper";
import { spacing } from "@/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

export const NotesListScreen = React.memo(function NotesListScreen() {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      <EmptyState
        iconFamily="Ionicons"
        iconName="document-text-outline"
        iconColor={colors.primary}
        title="No notes yet"
        description="Capture your thoughts and ideas."
      />
    </View>
  );
});

export default NotesListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: verticalScale(85),
  },
});
