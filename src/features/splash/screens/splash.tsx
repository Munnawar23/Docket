import { ThemeBackground } from "@/components";
import { useAppTheme } from "@/hooks/useAppTheme";
import { fontSize, spacing } from "@/theme/theme";
import { router } from "expo-router";
import * as ExpoSplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export function SplashScreen() {
  const { colors, fontFamily } = useAppTheme();

  useEffect(() => {
    ExpoSplashScreen.hideAsync().catch(() => {});
    const timer = setTimeout(() => {
      router.replace("/(drawer)");
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeBackground style={styles.container}>
      <View style={styles.content}>
        <View
          style={[
            styles.iconWrapper,
            {
              backgroundColor: `${colors.primary}18`,
              borderColor: `${colors.primary}30`,
            },
          ]}
        >
          <Text style={styles.icon}>📋</Text>
        </View>

        <Text
          style={[
            styles.appName,
            {
              color: colors.text,
              fontFamily: fontFamily.heading,
            },
          ]}
        >
          Docket
        </Text>

        <Text
          style={[
            styles.tagline,
            {
              color: colors.subtext,
              fontFamily: fontFamily.text,
            },
          ]}
        >
          Minimal & aesthetic notes
        </Text>
      </View>
    </ThemeBackground>
  );
}

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    width: spacing.avatarLg,
    height: spacing.avatarLg,
    borderRadius: spacing.xxl,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.vMd,
  },
  icon: {
    fontSize: fontSize.heading + 8,
  },
  appName: {
    fontSize: fontSize.heading + 4,
    letterSpacing: -0.5,
    marginBottom: spacing.vXs,
  },
  tagline: {
    fontSize: fontSize.body,
    letterSpacing: 0.2,
  },
});
