import { AppText } from "@/components";
import { spacing } from "@/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

export const NotesListScreen = React.memo(function NotesListScreen() {
  return (
    <View style={styles.container}>
      <AppText variant="heading">Notes</AppText>
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
  },
});
