import React, { type ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  type ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Haptics } from "@/lib/haptics";
import { fontSize, spacing } from "@/theme/theme";
import type { ThemeColors } from "@/theme/colors";
import type { ThemeFontFamily } from "@/theme/typography";

export interface ButtonProps {
  title: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  children?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  title,
  onPress,
  icon,
  children,
  disabled = false,
  loading = false,
  style,
}: ButtonProps) {
  const { colors, fontFamily } = useAppTheme();
  const styles = createStyles(colors, fontFamily);

  const handlePress = () => {
    Haptics.medium();
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <>
          {icon && (
            <Ionicons name={icon} size={spacing.iconSm} color="#FFFFFF" />
          )}
          {title ? (
            <Text
              style={styles.text}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.85}
            >
              {title}
            </Text>
          ) : null}
          {children}
        </>
      )}
    </Pressable>
  );
}

export default Button;

const createStyles = (colors: ThemeColors, fontFamily: ThemeFontFamily) =>
  StyleSheet.create({
    button: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: spacing.xxl,
      paddingVertical: spacing.vMd,
      paddingHorizontal: spacing.xxl,
      gap: spacing.xs,
      backgroundColor: colors.primary,
    },
    disabled: {
      opacity: 0.6,
    },
    pressed: {
      opacity: 0.8,
    },
    text: {
      color: "#FFFFFF",
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.bodyLg,
    },
  });
