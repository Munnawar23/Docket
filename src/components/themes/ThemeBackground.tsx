import { hp, wp } from "@/helpers/responsiveHelper";
import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { RoseDecoration } from "./RoseDecoration";
import { SageDecoration } from "./SageDecoration";
import { SkyDecoration } from "./SkyDecoration";

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

  return (
    <View style={styles.decorationLayer} pointerEvents="none">
      {themeMode === "rose" && <RoseDecoration color={activeColor} />}
      {themeMode === "sky" && <SkyDecoration color={activeColor} />}
      {themeMode === "sage" && <SageDecoration color={activeColor} />}
    </View>
  );
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
    width: wp(100),
    minHeight: hp(100),
  },
  decorationLayer: {
    position: "absolute",
    top: hp(0),
    left: wp(0),
    right: wp(0),
    bottom: hp(0),
    width: wp(100),
    height: hp(100),
  },
});
