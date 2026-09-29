import { scale, verticalScale } from "@/helpers/responsiveHelper";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Haptics } from "@/lib/haptics";
import { spacing, type ThemeColors } from "@/theme";
import {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
} from "@expo/vector-icons";
import React, { useMemo, type ReactNode } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { AppText } from "./AppText";

// ─── Supported Icon Families ──────────────────────────────────────────────────

export type ExpoIconFamily =
  | "Ionicons"
  | "MaterialCommunityIcons"
  | "Feather"
  | "FontAwesome"
  | "FontAwesome5"
  | "FontAwesome6"
  | "MaterialIcons"
  | "AntDesign"
  | "Octicons"
  | "Entypo"
  | "EvilIcons"
  | "Foundation"
  | "SimpleLineIcons"
  | "Zocial";

const ICON_FAMILIES = {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  MaterialIcons,
  AntDesign,
  Octicons,
  Entypo,
  EvilIcons,
  Foundation,
  SimpleLineIcons,
  Zocial,
} as const;

// ─── Props Interface ──────────────────────────────────────────────────────────

export interface EmptyStateProps {
  /** Title text (e.g. "No notes yet") */
  title?: string;
  /** Subtitle / descriptive guidance */
  description?: string;
  /** Expo vector icon family name (default: "Ionicons") */
  iconFamily?: ExpoIconFamily;
  /** Icon name corresponding to the iconFamily (e.g. "document-text-outline") */
  iconName?: string;
  /** Custom icon size (default: 40) */
  iconSize?: number;
  /** Custom icon color (defaults to theme primary color) */
  iconColor?: string;
  /** Background badge color behind the icon */
  iconBackgroundColor?: string;
  /** Optional custom title color */
  titleColor?: string;
  /** Optional custom description color */
  descriptionColor?: string;
  /** Optional custom icon ReactNode (takes precedence over iconName if provided) */
  iconNode?: ReactNode;
  /** Optional CTA button label */
  actionLabel?: string;
  /** Optional CTA button handler */
  onAction?: () => void;
  /** Optional custom action icon */
  actionIcon?: keyof typeof Ionicons.glyphMap;
  /** Additional container styling */
  style?: StyleProp<ViewStyle>;
  /** Optional children for custom content */
  children?: ReactNode;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const EmptyState = React.memo(function EmptyState({
  title,
  description,
  titleColor,
  descriptionColor,
  iconFamily = "Ionicons",
  iconName,
  iconSize = scale(40),
  iconColor,
  iconBackgroundColor,
  iconNode,
  actionLabel,
  onAction,
  actionIcon,
  style,
  children,
}: EmptyStateProps) {
  const { colors, isDark, isAestheticTheme } = useAppTheme();

  // Resolved colors
  const resolvedIconColor = iconColor || colors.primary;
  const resolvedBadgeBg =
    iconBackgroundColor ||
    (isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.035)");

  const resolvedDescColor =
    descriptionColor ||
    (isDark
      ? "rgba(255, 255, 255, 0.72)"
      : isAestheticTheme
        ? `${colors.text}CC`
        : "#4E4E4E");

  const styles = useMemo(
    () => createStyles(colors, isDark, resolvedBadgeBg),
    [colors, isDark, resolvedBadgeBg],
  );

  // Dynamic icon component lookup
  const IconComponent = ICON_FAMILIES[iconFamily] || Ionicons;

  const handleActionPress = () => {
    Haptics.light();
    onAction?.();
  };

  return (
    <View style={[styles.container, style]}>
      {/* Icon Badge Container */}
      {(iconNode || iconName) && (
        <View style={styles.iconBadge}>
          {iconNode ? (
            iconNode
          ) : (
            <IconComponent
              name={iconName as any}
              size={iconSize}
              color={resolvedIconColor}
            />
          )}
        </View>
      )}

      {/* Main Title */}
      {title ? (
        <AppText
          variant="title"
          semiBold
          color={titleColor || "text"}
          align="center"
          style={styles.title}
        >
          {title}
        </AppText>
      ) : null}

      {/* Descriptive Text */}
      {description ? (
        <AppText
          variant="body"
          medium
          color={resolvedDescColor}
          align="center"
          style={styles.description}
        >
          {description}
        </AppText>
      ) : null}

      {/* Optional CTA Action Button */}
      {actionLabel && onAction ? (
        <Pressable
          onPress={handleActionPress}
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.actionButtonPressed,
          ]}
        >
          {actionIcon ? (
            <Ionicons
              name={actionIcon}
              size={spacing.iconSm}
              color="#FFFFFF"
              style={styles.actionIcon}
            />
          ) : null}
          <AppText variant="bodySm" semiBold style={styles.actionButtonText}>
            {actionLabel}
          </AppText>
        </Pressable>
      ) : null}

      {/* Any additional custom children */}
      {children}
    </View>
  );
});

export default EmptyState;

// ─── Styles ───────────────────────────────────────────────────────────────────

const createStyles = (colors: ThemeColors, isDark: boolean, badgeBg: string) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: spacing.xxl,
      paddingVertical: verticalScale(28),
    },
    iconBadge: {
      width: scale(80),
      height: scale(80),
      borderRadius: scale(40),
      backgroundColor: badgeBg,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: verticalScale(10),
      borderWidth: 1,
      borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
    },
    title: {
      marginBottom: verticalScale(6),
    },
    description: {
      maxWidth: scale(310),
      lineHeight: verticalScale(23),
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary,
      paddingHorizontal: scale(18),
      paddingVertical: verticalScale(10),
      borderRadius: scale(20),
      marginTop: verticalScale(18),
    },
    actionButtonPressed: {
      opacity: 0.85,
      transform: [{ scale: 0.98 }],
    },
    actionIcon: {
      marginRight: scale(6),
    },
    actionButtonText: {
      color: "#FFFFFF",
    },
  });
