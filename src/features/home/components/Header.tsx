import { GlassIconButton } from "@/components";
import { verticalScale } from "@/helpers/responsiveHelper";
import { useAppSafeArea } from "@/hooks/useAppSafeArea";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Haptics } from "@/lib/haptics";
import { spacing, type ThemeColors } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import SearchBar from "./SearchBar";

export const Header = React.memo(function Header() {
  const { colors } = useAppTheme();
  const { top } = useAppSafeArea();
  const navigation = useNavigation<any>();

  const styles = useMemo(() => createStyles(top, colors), [top, colors]);

  const handleOpenDrawer = useCallback(() => {
    Haptics.light();
    navigation.toggleDrawer?.();
  }, [navigation]);

  const handleProfilePress = useCallback(() => {
    Haptics.light();
    console.log("[Header] Profile pressed");
  }, []);

  return (
    <View style={styles.container}>
      {/* Drawer Toggle */}
      <GlassIconButton onPress={handleOpenDrawer}>
        <Ionicons
          name="reorder-four-outline"
          size={spacing.iconMd}
          color={colors.text}
        />
      </GlassIconButton>

      {/* Search Bar */}
      <View style={styles.searchBarWrapper}>
        <SearchBar />
      </View>

      {/* Profile */}
      <GlassIconButton onPress={handleProfilePress}>
        <Ionicons
          name="person-outline"
          size={spacing.iconMd}
          color={colors.text}
        />
      </GlassIconButton>
    </View>
  );
});

export default Header;

// ─── Styles ───────────────────────────────────────────────────────────────────

const createStyles = (topInset: number, colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.screenPadding,
      paddingTop: topInset + verticalScale(5),
      paddingBottom: verticalScale(6),
      gap: spacing.sm,
      backgroundColor: colors.background,
      zIndex: 10,
    },
    searchBarWrapper: {
      flex: 1,
      overflow: "visible",
    },
  });
