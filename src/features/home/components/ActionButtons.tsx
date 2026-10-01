import { AppText } from "@/components/ui/AppText";
import { rs, scale, verticalScale } from "@/helpers/responsiveHelper";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Haptics } from "@/lib/haptics";
import { spacing, type ThemeColors } from "@/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useCallback, useMemo } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";

export interface ActionButtonsProps {
  selectedCount?: number;
  onDelete?: () => void;
  onPin?: () => void;
  onArchive?: () => void;
  onCancel?: () => void;
  bottomOffset?: number;
  style?: StyleProp<ViewStyle>;
}

export const ActionButtons = React.memo(function ActionButtons({
  selectedCount = 0,
  onDelete,
  onPin,
  onArchive,
  onCancel,
  bottomOffset,
  style,
}: ActionButtonsProps) {
  const { colors, isDark } = useAppTheme();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  const handleDelete = useCallback(() => {
    Haptics.medium();
    onDelete?.();
  }, [onDelete]);

  const handlePin = useCallback(() => {
    Haptics.light();
    onPin?.();
  }, [onPin]);

  const handleArchive = useCallback(() => {
    Haptics.light();
    onArchive?.();
  }, [onArchive]);

  const handleCancel = useCallback(() => {
    Haptics.light();
    onCancel?.();
  }, [onCancel]);

  return (
    <Animated.View
      entering={FadeInUp.duration(240)}
      exiting={FadeOutDown.duration(180)}
      style={[
        styles.container,
        bottomOffset !== undefined ? { bottom: bottomOffset } : undefined,
        style,
      ]}
      pointerEvents="box-none"
    >
      <View style={styles.bar}>
        {/* Left Side: Cancel Button + Selection Count */}
        <Pressable
          onPress={handleCancel}
          hitSlop={spacing.sm}
          style={({ pressed }) => [
            styles.cancelBtn,
            pressed && styles.btnPressed,
          ]}
        >
          <Ionicons name="close" size={rs.icon(20)} color={colors.text} />
          <AppText variant="bodySm" semiBold style={styles.countText}>
            {selectedCount}
          </AppText>
        </Pressable>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Right Side: 3 Action Icons (Archive, Pin, Delete) */}
        <View style={styles.actionsRow}>
          {/* 1. Archive */}
          <Pressable
            onPress={handleArchive}
            hitSlop={spacing.xs}
            style={({ pressed }) => [
              styles.actionBtn,
              pressed && styles.btnPressed,
            ]}
            accessibilityLabel="Archive selected notes"
          >
            <Ionicons
              name="archive-outline"
              size={rs.icon(22)}
              color={colors.text}
            />
          </Pressable>

          {/* 2. Pin - using MaterialCommunityIcons pin-outline with no-clip bounds */}
          <Pressable
            onPress={handlePin}
            hitSlop={spacing.xs}
            style={({ pressed }) => [
              styles.actionBtn,
              pressed && styles.btnPressed,
            ]}
            accessibilityLabel="Pin selected notes"
          >
            <MaterialCommunityIcons
              name="pin-outline"
              size={rs.icon(23)}
              color={colors.text}
            />
          </Pressable>

          {/* 3. Delete */}
          <Pressable
            onPress={handleDelete}
            hitSlop={spacing.xs}
            style={({ pressed }) => [
              styles.actionBtn,
              styles.deleteBtn,
              pressed && styles.btnPressed,
            ]}
            accessibilityLabel="Delete selected notes"
          >
            <Ionicons
              name="trash-outline"
              size={rs.icon(21)}
              color={colors.primary}
            />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
});

export default ActionButtons;

// ─── Styles ───────────────────────────────────────────────────────────────────

const createStyles = (colors: ThemeColors, isDark: boolean) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      left: 0,
      right: 0,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 100,
    },
    bar: {
      flexDirection: "row",
      alignItems: "center",
      minHeight: verticalScale(50),
      paddingHorizontal: spacing.md,
      borderRadius: spacing.xxl,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: spacing.vXs },
      shadowOpacity: isDark ? 0.35 : 0.12,
      shadowRadius: spacing.sm,
      elevation: 6,
      gap: spacing.sm,
    },
    cancelBtn: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: spacing.vXs,
      paddingHorizontal: spacing.xs,
      gap: spacing.xs,
    },
    countText: {
      color: colors.text,
      letterSpacing: 0.2,
    },
    divider: {
      width: 1,
      height: verticalScale(22),
      backgroundColor: colors.border,
    },
    actionsRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      overflow: "visible",
    },
    actionBtn: {
      width: scale(40),
      height: scale(40),
      borderRadius: scale(20),
      alignItems: "center",
      justifyContent: "center",
      overflow: "visible",
    },
    deleteBtn: {
      backgroundColor: colors.background,
    },
    btnPressed: {
      opacity: 0.6,
      transform: [{ scale: 0.92 }],
    },
  });
