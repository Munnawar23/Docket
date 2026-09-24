import { AppText, ThemeBackground } from "@/components";
import React from "react";
import { StyleSheet } from "react-native";

export default function LoginScreen() {
  return (
    <ThemeBackground style={styles.container}>
      <AppText variant="heading">
        Login
      </AppText>
    </ThemeBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
