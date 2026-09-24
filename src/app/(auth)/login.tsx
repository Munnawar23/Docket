import { AppText, ThemeBackground } from "@/components";
import { useAppTheme } from "@/hooks/useAppTheme";
import { rs } from "@/helpers/responsiveHelper";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function LoginScreen() {
  const { colors, fontFamily } = useAppTheme();

  return (
    <ThemeBackground style={styles.container}>
      <AppText
        style={{
          color: colors.text,
          fontFamily: fontFamily.heading,
          fontSize: rs.font(24),
        }}
      >
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
