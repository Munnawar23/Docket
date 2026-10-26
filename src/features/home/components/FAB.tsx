import { useAppTheme } from "@/hooks/useAppTheme";
import { Haptics } from "@/lib/haptics";
import { spacing, type ThemeColors, type ThemeFontFamily } from "@/theme";
import { AppText } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";
import { hp, wp, scale, verticalScale } from "@/helpers/responsiveHelper";

const FAB_SIZE = scale(48);
const PILL_HEIGHT = verticalScale(46);
const PILL_WIDTH = scale(115);
const PILL_GAP = verticalScale(10);

type FABOptionId = "note" | "task" | "image" | "audio";

type FABOption = {
  id: FABOptionId;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const FAB_OPTIONS: FABOption[] = [
  { id: "note", label: "Note", icon: "document-text-outline" },
  { id: "task", label: "Task", icon: "checkbox-outline" },
  { id: "image", label: "Image", icon: "image-outline" },
  { id: "audio", label: "Audio", icon: "mic-outline" },
];

export interface FABProps {
  onAddNote?: () => void;
  onAddTask?: () => void;
  onAddImage?: () => void;
  onAddAudio?: () => void;
  bottomOffset?: number;
  style?: StyleProp<ViewStyle>;
}

export const FAB = React.memo(function FAB({
  onAddNote,
  onAddTask,
  onAddImage,
  onAddAudio,
  bottomOffset = hp(3),
  style,
}: FABProps = {}) {
  const { colors, fontFamily, isDark } = useAppTheme();
  const styles = useMemo(
    () => createStyles(colors, fontFamily, isDark),
    [colors, fontFamily, isDark]
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    Haptics.light();
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    Haptics.light();
    setIsMenuOpen(false);
  }, []);

  return (
    <>
      {/* Backdrop */}
      {isMenuOpen && (
        <View style={styles.backdrop}>
          <Pressable style={styles.backdropPressable} onPress={closeMenu} />
        </View>
      )}

      {/* FAB Container */}
      <View
        style={[
          styles.fabArea,
          bottomOffset !== undefined ? { bottom: bottomOffset } : undefined,
          style,
        ]}
        pointerEvents="box-none"
      >
        {/* Pill options */}
        {isMenuOpen &&
          FAB_OPTIONS.map((option, index) => {
            const pillBottom =
              FAB_SIZE + spacing.sm + index * (PILL_HEIGHT + PILL_GAP);
            return (
              <View
                key={option.id}
                style={[styles.pillWrapper, { bottom: pillBottom }]}
              >
                <Pressable
                  onPress={() => {
                    closeMenu();
                    if (option.id === "note") onAddNote?.();
                    else if (option.id === "task") onAddTask?.();
                    else if (option.id === "image") onAddImage?.();
                    else if (option.id === "audio") onAddAudio?.();
                  }}
                  style={({ pressed }) => [
                    styles.pill,
                    pressed && styles.pillPressed,
                  ]}
                >
                  <View style={styles.pillContent}>
                    <AppText variant="bodyLg" semiBold style={styles.pillLabel}>
                      {option.label}
                    </AppText>
                    <View style={styles.pillIconBadge}>
                      <Ionicons
                        name={option.icon}
                        size={scale(16)}
                        color="#FFFFFF"
                      />
                    </View>
                  </View>
                </Pressable>
              </View>
            );
          })}

        {/* Primary FAB button */}
        <Pressable
          onPress={toggleMenu}
          hitSlop={spacing.sm}
          style={({ pressed }) => [
            styles.fab,
            pressed && styles.fabPressed,
          ]}
        >
          <View style={styles.fabContent}>
            <Ionicons
              name={isMenuOpen ? "close" : "add"}
              size={scale(24)}
              color="#FFFFFF"
            />
          </View>
        </Pressable>
      </View>
    </>
  );
});

export default FAB;

const createStyles = (
  colors: ThemeColors,
  fontFamily: ThemeFontFamily,
  isDark: boolean,
) =>
  StyleSheet.create({
    backdrop: {
      ...StyleSheet.absoluteFill as any,
      backgroundColor: "rgba(0, 0, 0, 0.45)",
      zIndex: 90,
    },
    backdropPressable: {
      flex: 1,
    },
    fabArea: {
      position: "absolute",
      right: wp(4.2),
      alignItems: "flex-end",
      zIndex: 100,
    },
    fab: {
      width: FAB_SIZE,
      height: FAB_SIZE,
      borderRadius: FAB_SIZE / 2,
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.28)",
      backgroundColor: colors.primary,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: spacing.vXs },
      shadowOpacity: 0.38,
      shadowRadius: spacing.sm,
      elevation: 6,
    },
    fabContent: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    fabPressed: {
      opacity: 0.8,
      transform: [{ scale: 0.94 }],
    },
    pillWrapper: {
      position: "absolute",
      right: 0,
      alignItems: "flex-end",
    },
    pill: {
      width: PILL_WIDTH,
      height: PILL_HEIGHT,
      borderRadius: PILL_HEIGHT / 2,
      borderWidth: 1,
      borderColor: isDark ? colors.border : "rgba(0, 0, 0, 0.08)",
      backgroundColor: colors.card,
      ...Platform.select({
        ios: {
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: verticalScale(2) },
          shadowOpacity: isDark ? 0.35 : 0.12,
          shadowRadius: scale(4),
        },
        android: {
          elevation: 4,
        },
        web: {
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: verticalScale(2) },
          shadowOpacity: isDark ? 0.35 : 0.12,
          shadowRadius: scale(4),
        },
      }),
    },
    pillContent: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingLeft: scale(14),
      paddingRight: scale(8),
    },
    pillIconBadge: {
      width: scale(28),
      height: scale(28),
      borderRadius: scale(14),
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary,
    },
    pillPressed: {
      opacity: 0.8,
      transform: [{ scale: 0.96 }],
    },
    pillLabel: {
      color: colors.text,
      fontFamily: fontFamily.semiBold,
    },
  });
