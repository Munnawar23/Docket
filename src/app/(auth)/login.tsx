import { ThemeBackground } from "@/components";
import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function LoginScreen() {
  const { colors, fontFamily } = useAppTheme();

  return (
    <ThemeBackground style={styles.container}>
      <Text style={{ color: colors.text, fontFamily: fontFamily.heading }}>
        Login
      </Text>
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
