import { useAppTheme } from "@/hooks/useAppTheme";
import { Haptics } from "@/lib/haptics";
import { fontSize, spacing, type ThemeColors, type ThemeFontFamily } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { AppTextInput, type AppTextInputRef } from "@/components";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Animated as RNAnimated,
  Platform,
  Pressable,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";
import { scale, verticalScale } from "@/helpers/responsiveHelper";

const HEIGHT = verticalScale(44);
const BORDER_RADIUS = scale(16);
const ICON_SIZE = scale(17);

export interface SearchBarProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onSubmit?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const SearchBar = React.memo(function SearchBar({
  value: controlledValue,
  onChangeText: controlledOnChangeText,
  placeholder = "Search…",
  onClear,
  onFocus,
  onBlur,
  onSubmit,
  style,
}: SearchBarProps = {}) {
  const { colors, fontFamily, isDark, isAestheticTheme } = useAppTheme();
  const [internalQuery, setInternalQuery] = useState("");
  const isControlled = controlledValue !== undefined;
  const query = isControlled ? controlledValue : internalQuery;

  const [isFocused, setIsFocused] = useState(false);
  const glowAnim = useRef(new RNAnimated.Value(0)).current;
  const inputRef = useRef<AppTextInputRef>(null);

  const styles = useMemo(
    () => createStyles(colors, fontFamily, isDark, isAestheticTheme),
    [colors, fontFamily, isDark, isAestheticTheme]
  );

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    onFocus?.();
    RNAnimated.spring(glowAnim, {
      toValue: 1,
      useNativeDriver: false,
      speed: 20,
      bounciness: 4,
    }).start();
  }, [glowAnim, onFocus]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlur?.();
    RNAnimated.spring(glowAnim, {
      toValue: 0,
      useNativeDriver: false,
      speed: 20,
      bounciness: 0,
    }).start();
  }, [glowAnim, onBlur]);

  const handleChangeText = useCallback(
    (text: string) => {
      if (!isControlled) {
        setInternalQuery(text);
      }
      controlledOnChangeText?.(text);
    },
    [isControlled, controlledOnChangeText]
  );

  const handleClear = useCallback(() => {
    Haptics.light();
    if (!isControlled) {
      setInternalQuery("");
    }
    controlledOnChangeText?.("");
    onClear?.();
    inputRef.current?.focus();
  }, [isControlled, controlledOnChangeText, onClear]);

  // Dynamic frosted glass border with smooth animated focus glow
  const restBorderColor = isDark
    ? "rgba(255, 255, 255, 0.2)"
    : isAestheticTheme
    ? "rgba(255, 255, 255, 0.9)"
    : "rgba(255, 255, 255, 0.85)";

  const activeBorderColor = `${colors.primary}CC`;

  const borderColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [restBorderColor, activeBorderColor],
  });

  // Liquid glass specular light refraction sheen (iOS fluid glass reflection)
  const sheenColors = useMemo<[string, string, string]>(() => {
    if (isDark) {
      return [
        "rgba(255, 255, 255, 0.22)",
        "rgba(58, 58, 60, 0.35)",
        "rgba(28, 28, 30, 0.5)",
      ];
    }
    if (isAestheticTheme) {
      return [
        "rgba(255, 255, 255, 0.9)",
        "rgba(255, 255, 255, 0.45)",
        "rgba(255, 255, 255, 0.15)",
      ];
    }
    return [
      "rgba(255, 255, 255, 0.85)",
      "rgba(255, 255, 255, 0.35)",
      "rgba(230, 230, 238, 0.3)",
    ];
  }, [isDark, isAestheticTheme]);

  // Optimized blur configuration across platforms
  const blurIntensity = isDark ? 60 : isAestheticTheme ? 80 : 75;
  const blurTint = isDark ? "dark" : "light";

  return (
    <RNAnimated.View style={[styles.outerWrapper, { borderColor }, style]}>
      {/* 1. Base translucent underlay */}
      <View style={styles.glassBase} />

      {/* 2. Blur layer (iOS only; avoids dimezisBlurView redraw artifacts on Android) */}
      {Platform.OS === "ios" && (
        <BlurView
          intensity={blurIntensity}
          tint={blurTint}
          style={StyleSheet.absoluteFill}
        />
      )}

      {/* 3. Liquid Glass Specular Gradient Reflection Sheen */}
      <LinearGradient
        colors={sheenColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* 4. Interactive Row Content */}
      <View style={styles.row}>
        {/* Search icon */}
        <Ionicons
          name={isFocused ? "search" : "search-outline"}
          size={ICON_SIZE}
          color={isFocused ? colors.primary : colors.subtext}
          style={styles.searchIcon}
        />

        {/* Input */}
        <AppTextInput
          ref={inputRef}
          style={[
            styles.input,
            Platform.select({
              web: {
                outlineStyle: "none",
                outlineWidth: 0,
                backgroundColor: "transparent",
                boxShadow: "none",
                borderWidth: 0,
              } as any,
              default: {
                backgroundColor: "transparent",
              },
            }),
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.subtext}
          value={query}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={onSubmit}
          returnKeyType="search"
          clearButtonMode="never"
          selectionColor={colors.primary}
          cursorColor={colors.primary}
          underlineColorAndroid="transparent"
          disableFullscreenUI
          autoComplete="off"
          autoCorrect={false}
          spellCheck={false}
          importantForAutofill="no"
          textAlignVertical="center"
        />

        {/* Clear Button */}
        {query.length > 0 && (
          <Pressable
            onPress={handleClear}
            hitSlop={spacing.sm}
            style={({ pressed }) => [
              styles.clearButton,
              pressed && styles.clearButtonPressed,
            ]}
          >
            <Ionicons
              name="close-circle"
              size={ICON_SIZE}
              color={colors.subtext}
            />
          </Pressable>
        )}
      </View>
    </RNAnimated.View>
  );
});

export default SearchBar;

const createStyles = (
  colors: ThemeColors,
  fontFamily: ThemeFontFamily,
  isDark: boolean,
  isAestheticTheme: boolean
) =>
  StyleSheet.create({
    outerWrapper: {
      flex: 1,
      minHeight: HEIGHT,
      borderRadius: BORDER_RADIUS,
      overflow: "hidden",
      borderWidth: 1,
      position: "relative",
      backgroundColor: "transparent",
      ...Platform.select({
        ios: {
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: verticalScale(3) },
          shadowOpacity: isDark ? 0.35 : 0.08,
          shadowRadius: scale(8),
        },
        android: {
          elevation: 0,
        },
        web: {
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: verticalScale(3) },
          shadowOpacity: isDark ? 0.35 : 0.08,
          shadowRadius: scale(8),
        },
      }),
    },
    glassBase: {
      ...StyleSheet.absoluteFill as any,
      backgroundColor:
        Platform.OS === "android"
          ? isDark
            ? "rgba(30, 30, 34, 0.68)"
            : isAestheticTheme
            ? "rgba(255, 255, 255, 0.55)"
            : "rgba(255, 255, 255, 0.6)"
          : isDark
          ? "rgba(28, 28, 30, 0.35)"
          : isAestheticTheme
          ? "rgba(255, 255, 255, 0.35)"
          : "rgba(255, 255, 255, 0.35)",
    },
    row: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.md,
      zIndex: 1,
    },
    searchIcon: {
      marginRight: spacing.xs,
    },
    input: {
      flex: 1,
      height: "100%",
      fontSize: fontSize.body,
      fontFamily: fontFamily.regular,
      color: colors.text,
      paddingVertical: 0,
      paddingHorizontal: 0,
      margin: 0,
      borderWidth: 0,
      borderColor: "transparent",
      backgroundColor: "transparent",
      includeFontPadding: false,
      textAlignVertical: "center",
      ...Platform.select({
        web: {
          outlineStyle: "none",
          outlineWidth: 0,
          boxShadow: "none",
          border: "none",
          backgroundColor: "transparent",
        } as any,
        android: {
          paddingHorizontal: 0,
          paddingVertical: 0,
        },
      }),
    },
    clearButton: {
      marginLeft: spacing.xs,
      justifyContent: "center",
      alignItems: "center",
    },
    clearButtonPressed: {
      opacity: 0.5,
    },
  });
