import { ThemeBackground } from "@/components";
import { useAppTheme } from "@/hooks/useAppTheme";
import { fontSize } from "@/theme/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function HomeScreen() {
  const { colors, fontFamily } = useAppTheme();

  return (
    <ThemeBackground style={styles.container}>
      <View style={styles.content}>
        <Text
          style={[
            styles.text,
            {
              color: colors.text,
              fontFamily: fontFamily.heading,
            },
          ]}
        >
          Home
        </Text>
      </View>
    </ThemeBackground>
  );
}

export default HomeScreen;

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
  text: {
    fontSize: fontSize.heading,
  },
});
