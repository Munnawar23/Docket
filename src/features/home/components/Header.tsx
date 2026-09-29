import React, { useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { GlassIconButton } from "@/components";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useAppSafeArea } from "@/hooks/useAppSafeArea";
import { Haptics } from "@/lib/haptics";
import { spacing } from "@/theme";
import { hp } from "@/helpers/responsiveHelper";
import SearchBar from "./SearchBar";

export const Header = React.memo(function Header() {
  const { colors } = useAppTheme();
  const { top } = useAppSafeArea();
  const navigation = useNavigation<any>();

  const styles = useMemo(() => createStyles(top), [top]);

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

const createStyles = (topInset: number) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.screenPadding,
      paddingTop: topInset + hp(1),
      paddingBottom: hp(0.5),
      gap: spacing.sm,
    },
    searchBarWrapper: {
      flex: 1,
    },
  });
