import { useAppTheme } from "@/hooks/useAppTheme";
import { Haptics } from "@/lib/haptics";
import { spacing } from "@/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React, { useCallback } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { scale } from "react-native-size-matters";

const BUTTON_SIZE = scale(40);

export const Header = React.memo(function Header() {
  const { colors, isDark } = useAppTheme();
  const navigation = useNavigation<any>();

  const handleOpenDrawer = useCallback(() => {
    Haptics.light();
    navigation.toggleDrawer?.();
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Drawer Toggle Button */}
      <Pressable
        onPress={handleOpenDrawer}
        style={({ pressed }) => [
          styles.circleButton,
          isDark ? styles.buttonDark : styles.buttonLight,
          pressed && styles.pressed,
        ]}
        hitSlop={spacing.sm}
      >
        <Ionicons
          name="reorder-four-outline"
          size={spacing.iconMd}
          color={colors.text}
        />
      </Pressable>
    </View>
  );
});

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.vSm,
  },
  circleButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDark: {
    backgroundColor: "#242426",
  },
  buttonLight: {
    backgroundColor: "#E4E4E6",
  },
  pressed: {
    opacity: 0.7,
  },
});
