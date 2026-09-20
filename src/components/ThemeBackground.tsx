import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { ButterDecoration } from "./decorations/ButterDecoration";
import { RoseDecoration } from "./decorations/RoseDecoration";
import { SkyDecoration } from "./decorations/SkyDecoration";

export interface ThemeBackgroundProps {
  children?: React.ReactNode;
  showDecorations?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function ThemeDecorationLayer({
  colorOverride,
}: {
  colorOverride?: string;
}) {
  const { themeMode, colors, isAestheticTheme } = useAppTheme();
  const activeColor = colorOverride || colors.primary;

  if (!isAestheticTheme) {
    return null;
  }

  switch (themeMode) {
    case "rose":
      return <RoseDecoration color={activeColor} />;
    case "butter":
      return <ButterDecoration color={activeColor} />;
    case "sky":
      return <SkyDecoration color={activeColor} />;
    default:
      return null;
  }
}

export function ThemeBackground({
  children,
  showDecorations = true,
  style,
}: ThemeBackgroundProps) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background }, style]}
    >
      {showDecorations && <ThemeDecorationLayer />}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
