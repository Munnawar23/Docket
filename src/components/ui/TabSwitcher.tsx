import React, { useMemo } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Haptics } from "@/lib/haptics";
import { spacing, type ThemeColors, type ThemeFontFamily } from "@/theme";
import { scale } from "@/helpers/responsiveHelper";
import { AppText } from "./AppText";

export interface TabOption {
  label: string;
  value: string;
}

export interface TabSwitcherProps {
  tabs: TabOption[];
  activeTab: string;
  onTabChange: (value: string) => void;
  style?: StyleProp<ViewStyle>;
}

export const TabSwitcher = React.memo(function TabSwitcher({
  tabs,
  activeTab,
  onTabChange,
  style,
}: TabSwitcherProps) {
  const { colors, fontFamily, isDark } = useAppTheme();
  const styles = useMemo(
    () => createStyles(colors, fontFamily, isDark),
    [colors, fontFamily, isDark],
  );

  return (
    <View style={[styles.container, style]}>
      <View style={styles.track}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <Pressable
              key={tab.value}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => {
                if (!isActive) {
                  Haptics.light();
                  onTabChange(tab.value);
                }
              }}
            >
              <AppText
                style={[
                  styles.tabText,
                  isActive ? styles.tabTextActive : styles.tabTextInactive,
                ]}
                numberOfLines={1}
              >
                {tab.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
});

export default TabSwitcher;

const createStyles = (
  colors: ThemeColors,
  fontFamily: ThemeFontFamily,
  isDark: boolean,
) =>
  StyleSheet.create({
    container: {
      width: scale(190),
      alignSelf: "center",
    },
    track: {
      flexDirection: "row",
      backgroundColor: colors.background,
      borderRadius: spacing.xxl,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.xs,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: spacing.vXs },
      shadowOpacity: isDark ? 0.35 : 0.08,
      shadowRadius: spacing.sm,
      elevation: 3,
    },
    tab: {
      flex: 1,
      paddingVertical: spacing.vSm,
      paddingHorizontal: spacing.sm,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: spacing.xl,
    },
    activeTab: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: spacing.vXs },
      shadowOpacity: isDark ? 0.25 : 0.08,
      shadowRadius: spacing.xs,
      elevation: 2,
    },
    tabText: {
      textAlign: "center",
    },
    tabTextActive: {
      fontFamily: fontFamily.bold,
      color: colors.primary,
    },
    tabTextInactive: {
      fontFamily: fontFamily.semiBold,
      color: colors.subtext,
    },
  });
