import { ThemeBackground } from "../ThemeBackground";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Haptics } from "@/lib/haptics";
import { type ThemeMode } from "@/store/themeStore";
import { fontSize, spacing } from "@/theme/theme";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export function DevTheme() {
  const [shouldCrash, setShouldCrash] = useState(false);

  if (shouldCrash) {
    throw new Error(
      "Simulated Test Crash: ErrorBoundary caught this error triggered from the DevTheme component."
    );
  }

  const {
    colors,
    fontFamily,
    isDark,
    isAestheticTheme,
    themeMode,
    setThemeMode,
    activeScheme,
    systemColorScheme,
  } = useAppTheme();

  const handleSelectMode = (mode: ThemeMode) => {
    Haptics.light();
    setThemeMode(mode);
  };

  const themeOptions: {
    mode: ThemeMode;
    label: string;
    icon: string;
    desc: string;
  }[] = [
    { mode: "light", label: "Light", icon: "☀️", desc: "Crisp & bright" },
    { mode: "dark", label: "Dark", icon: "🌙", desc: "Easy on the eyes" },
    {
      mode: "system",
      label: "System",
      icon: "⚙️",
      desc: `Auto (${systemColorScheme})`,
    },
  ];

  const aestheticOptions: {
    mode: ThemeMode;
    label: string;
    icon: string;
    desc: string;
    bg: string;
    accent: string;
  }[] = [
    {
      mode: "rose",
      label: "Rose",
      icon: "🌸",
      desc: "Soft & romantic",
      bg: "#FFF0F5",
      accent: "#F43F8E",
    },
    {
      mode: "sky",
      label: "Sky",
      icon: "☁️",
      desc: "Airy & calm",
      bg: "#F0F8FF",
      accent: "#38BDF8",
    },
    {
      mode: "butter",
      label: "Butter",
      icon: "🧈",
      desc: "Warm & cozy",
      bg: "#FFFEF7",
      accent: "#FAD02C",
    },
  ];

  const paletteItems: {
    key: keyof typeof colors;
    name: string;
    hex: string;
    usage: string;
  }[] = [
    {
      key: "background",
      name: "background",
      hex: colors.background,
      usage: "Canvas & main screen backdrop",
    },
    {
      key: "card",
      name: "card",
      hex: colors.card,
      usage: "Elevated note surfaces & containers",
    },
    {
      key: "text",
      name: "text",
      hex: colors.text,
      usage: "Main headings & readable body text",
    },
    {
      key: "subtext",
      name: "subtext",
      hex: colors.subtext,
      usage: "Dates, metadata & secondary labels",
    },
    {
      key: "primary",
      name: "primary",
      hex: colors.primary,
      usage: "Accent tags, highlights & active buttons",
    },
    {
      key: "border",
      name: "border",
      hex: colors.border,
      usage: "Subtle dividers & card outlines",
    },
  ];

  return (
    <ThemeBackground>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text
            style={[
              styles.appTitle,
              { color: colors.text, fontFamily: fontFamily.heading },
            ]}
          >
            Docket 📋
          </Text>
          <Text
            style={[
              styles.appSubtitle,
              { color: colors.subtext, fontFamily: fontFamily.text },
            ]}
          >
            Minimal Notes Theme Demo
          </Text>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: `${colors.primary}22`,
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: colors.primary, fontFamily: fontFamily.bold },
              ]}
            >
              Active: {activeScheme.toUpperCase()} ({themeMode})
            </Text>
          </View>

          {/* Atmospheric Decoration Status (Special Themes Only) */}
          {isAestheticTheme && (
            <View
              style={[
                styles.decorationBadge,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.decorationBadgeText,
                  { color: colors.subtext, fontFamily: fontFamily.medium },
                ]}
              >
                {themeMode === "rose" && "🌸 Background: Blooming Roses & Floating Petals"}
                {themeMode === "butter" && "☀️ Background: Glowing Sun, Sunbeams & Golden Twinkles"}
                {themeMode === "sky" && "☁️ Background: Drifting Soft Clouds & Sky Breeze"}
              </Text>
            </View>
          )}
        </View>

        {/* Standard Theme Switcher */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.text, fontFamily: fontFamily.title },
            ]}
          >
            Default Themes
          </Text>
          <View style={styles.buttonRow}>
            {themeOptions.map((item) => {
              const isSelected = themeMode === item.mode;
              return (
                <TouchableOpacity
                  key={item.mode}
                  activeOpacity={0.7}
                  onPress={() => handleSelectMode(item.mode)}
                  style={[
                    styles.themeButton,
                    {
                      backgroundColor: isSelected
                        ? colors.primary
                        : colors.card,
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text style={styles.buttonIcon}>{item.icon}</Text>
                  <Text
                    style={[
                      styles.buttonLabel,
                      {
                        color: isSelected ? "#FFFFFF" : colors.text,
                        fontFamily: isSelected
                          ? fontFamily.bold
                          : fontFamily.medium,
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                  <Text
                    style={[
                      styles.buttonDesc,
                      {
                        color: isSelected
                          ? "rgba(255,255,255,0.85)"
                          : colors.subtext,
                        fontFamily: fontFamily.regular,
                      },
                    ]}
                  >
                    {item.desc}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ✨ Aesthetic Themes */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.text, fontFamily: fontFamily.title },
            ]}
          >
            ✨ Aesthetic Themes
          </Text>
          <Text
            style={[
              styles.sectionSubtitle,
              { color: colors.subtext, fontFamily: fontFamily.text },
            ]}
          >
            Standalone palette + Boogaloo & Nunito fonts
          </Text>
          <View style={styles.aestheticRow}>
            {aestheticOptions.map((item) => {
              const isSelected = themeMode === item.mode;
              return (
                <TouchableOpacity
                  key={item.mode}
                  activeOpacity={0.75}
                  onPress={() => handleSelectMode(item.mode)}
                  style={[
                    styles.aestheticButton,
                    {
                      backgroundColor: item.bg,
                      borderColor: isSelected ? item.accent : `${item.accent}44`,
                      borderWidth: isSelected ? 2.5 : 1.5,
                    },
                  ]}
                >
                  {/* Selected indicator dot */}
                  {isSelected && (
                    <View
                      style={[
                        styles.selectedDot,
                        { backgroundColor: item.accent },
                      ]}
                    />
                  )}
                  <Text style={styles.aestheticIcon}>{item.icon}</Text>
                  <Text
                    style={[
                      styles.aestheticLabel,
                      {
                        color: isSelected ? item.accent : "#333",
                        fontFamily: "Boogaloo-Regular",
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                  <Text
                    style={[
                      styles.aestheticDesc,
                      {
                        color: isSelected ? item.accent : "#888",
                        fontFamily: "Nunito-Regular",
                      },
                    ]}
                  >
                    {item.desc}
                  </Text>
                  {/* Color preview strip */}
                  <View
                    style={[
                      styles.accentStrip,
                      { backgroundColor: item.accent },
                    ]}
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Font preview when aesthetic theme active */}
          {isAestheticTheme && (
            <View
              style={[
                styles.fontPreviewCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Text
                style={[
                  styles.fontPreviewHeading,
                  { color: colors.primary, fontFamily: "Boogaloo-Regular" },
                ]}
              >
                Boogaloo — Heading Style
              </Text>
              <Text
                style={[
                  styles.fontPreviewBody,
                  { color: colors.text, fontFamily: "Nunito-Regular" },
                ]}
              >
                Nunito Regular — body text flows cleanly
              </Text>
              <Text
                style={[
                  styles.fontPreviewBody,
                  { color: colors.subtext, fontFamily: "Nunito-SemiBold" },
                ]}
              >
                Nunito SemiBold — labels & subtitles
              </Text>
              <Text
                style={[
                  styles.fontPreviewBody,
                  { color: colors.text, fontFamily: "Nunito-Bold" },
                ]}
              >
                Nunito Bold — section headings
              </Text>
            </View>
          )}
        </View>

        {/* Color Palette List */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.text, fontFamily: fontFamily.title },
            ]}
          >
            Active Color Palette ({paletteItems.length} Tokens)
          </Text>
          <View style={styles.paletteContainer}>
            {paletteItems.map((item) => (
              <View
                key={item.name}
                style={[
                  styles.paletteCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <View
                  style={[
                    styles.colorSwatch,
                    {
                      backgroundColor: item.hex,
                      borderColor:
                        item.name === "background" || item.name === "card"
                          ? colors.border
                          : "transparent",
                    },
                  ]}
                />
                <View style={styles.paletteInfo}>
                  <View style={styles.paletteTitleRow}>
                    <Text
                      style={[
                        styles.tokenName,
                        { color: colors.text, fontFamily: fontFamily.semiBold },
                      ]}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={[styles.tokenHex, { color: colors.primary }]}
                    >
                      {item.hex}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.tokenUsage,
                      { color: colors.subtext, fontFamily: fontFamily.regular },
                    ]}
                  >
                    {item.usage}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Live Note Card Preview */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.text, fontFamily: fontFamily.title },
            ]}
          >
            Live Note Preview
          </Text>
          <View
            style={[
              styles.previewCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.previewHeader}>
              <View
                style={[
                  styles.previewTag,
                  { backgroundColor: `${colors.primary}22` },
                ]}
              >
                <Text
                  style={[
                    styles.previewTagText,
                    { color: colors.primary, fontFamily: fontFamily.bold },
                  ]}
                >
                  Productivity
                </Text>
              </View>
              <Text
                style={[
                  styles.previewDate,
                  { color: colors.subtext, fontFamily: fontFamily.medium },
                ]}
              >
                Today, 3:30 PM
              </Text>
            </View>

            <Text
              style={[
                styles.previewTitle,
                { color: colors.text, fontFamily: fontFamily.heading },
              ]}
            >
              Design System & Scaled Typography
            </Text>
            <Text
              style={[
                styles.previewBody,
                { color: colors.subtext, fontFamily: fontFamily.text },
              ]}
            >
              Responsive spacing and typography scale seamlessly across devices
              with react-native-size-matters.
            </Text>
          </View>
        </View>

        {/* Storage Persistence Info Box */}
        <View
          style={[
            styles.infoCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text
            style={[
              styles.infoTitle,
              { color: colors.text, fontFamily: fontFamily.bold },
            ]}
          >
            💾 Persistent State
          </Text>
          <Text
            style={[
              styles.infoText,
              { color: colors.subtext, fontFamily: fontFamily.regular },
            ]}
          >
            Theme mode changes are automatically saved to storage via{" "}
            <Text
              style={{ color: colors.primary, fontFamily: fontFamily.semiBold }}
            >
              appStorage
            </Text>{" "}
            (Zustand persist).
          </Text>
        </View>

        {/* Error Boundary Test Button */}
        <View style={styles.section}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              Haptics.heavy();
              setShouldCrash(true);
            }}
            style={[
              styles.errorTestButton,
              {
                backgroundColor: colors.card,
                borderColor: `${colors.border}`,
              },
            ]}
          >
            <Text
              style={[
                styles.errorTestButtonText,
                {
                  color: "#FF3B30",
                  fontFamily: fontFamily.semiBold,
                },
              ]}
            >
              ⚠️ Trigger Error Boundary (Test)
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemeBackground>
  );
}

export default DevTheme;

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.vXxxl,
  },
  header: {
    marginTop: spacing.vLg,
    marginBottom: spacing.vXxl,
    alignItems: "center",
  },
  appTitle: {
    fontSize: fontSize.heading,
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: fontSize.body,
    marginTop: spacing.vXs,
  },
  badge: {
    marginTop: spacing.vMd,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.vXs,
    borderRadius: spacing.xl,
  },
  badgeText: {
    fontSize: fontSize.caption,
    letterSpacing: 0.5,
  },
  decorationBadge: {
    marginTop: spacing.vSm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.vXs,
    borderRadius: spacing.sm,
    borderWidth: 1,
    alignItems: "center",
  },
  decorationBadgeText: {
    fontSize: fontSize.caption - 1,
  },
  section: {
    marginBottom: spacing.vXxl,
  },
  sectionTitle: {
    fontSize: fontSize.title,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    fontSize: fontSize.caption,
    marginBottom: spacing.sectionHeaderBottom,
  },
  buttonRow: {
    flexDirection: "row",
    gap: spacing.itemGap,
  },
  themeButton: {
    flex: 1,
    paddingVertical: spacing.vMd,
    paddingHorizontal: spacing.sm,
    borderRadius: spacing.md,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonIcon: {
    fontSize: fontSize.heading,
    marginBottom: spacing.vXs,
  },
  buttonLabel: {
    fontSize: fontSize.body,
    marginBottom: 2,
  },
  buttonDesc: {
    fontSize: fontSize.caption - 1,
    textAlign: "center",
  },
  // Aesthetic themes
  aestheticRow: {
    flexDirection: "row",
    gap: spacing.itemGap,
  },
  aestheticButton: {
    flex: 1,
    paddingVertical: spacing.vMd,
    paddingHorizontal: spacing.sm,
    borderRadius: spacing.md,
    alignItems: "center",
    overflow: "hidden",
  },
  selectedDot: {
    position: "absolute",
    top: spacing.vXs,
    right: spacing.xs,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  aestheticIcon: {
    fontSize: fontSize.heading,
    marginBottom: spacing.vXs,
  },
  aestheticLabel: {
    fontSize: fontSize.bodyLg,
    marginBottom: 2,
  },
  aestheticDesc: {
    fontSize: fontSize.caption - 1,
    textAlign: "center",
    marginBottom: spacing.vSm,
  },
  accentStrip: {
    height: 3,
    width: "60%",
    borderRadius: 2,
    marginTop: spacing.vXs,
  },
  fontPreviewCard: {
    marginTop: spacing.vMd,
    padding: spacing.lg,
    borderRadius: spacing.md,
    borderWidth: 1,
    gap: spacing.vXs,
  },
  fontPreviewHeading: {
    fontSize: fontSize.cardTitle,
  },
  fontPreviewBody: {
    fontSize: fontSize.body,
  },
  // Palette
  paletteContainer: {
    gap: spacing.itemGap,
  },
  paletteCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: spacing.md,
    borderWidth: 1,
  },
  colorSwatch: {
    width: spacing.xxxl,
    height: spacing.xxxl,
    borderRadius: spacing.sm,
    borderWidth: 1,
    marginRight: spacing.md,
  },
  paletteInfo: {
    flex: 1,
  },
  paletteTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  tokenName: {
    fontSize: fontSize.bodyLg,
  },
  tokenHex: {
    fontSize: fontSize.caption,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  tokenUsage: {
    fontSize: fontSize.caption,
  },
  // Note preview
  previewCard: {
    padding: spacing.lg,
    borderRadius: spacing.md,
    borderWidth: 1,
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.vSm,
  },
  previewTag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.vXs,
    borderRadius: spacing.xs,
  },
  previewTagText: {
    fontSize: fontSize.caption,
  },
  previewDate: {
    fontSize: fontSize.caption,
  },
  previewTitle: {
    fontSize: fontSize.title,
    marginBottom: spacing.vXs,
    letterSpacing: -0.2,
  },
  previewBody: {
    fontSize: fontSize.body,
    lineHeight: spacing.vXl,
  },
  infoCard: {
    padding: spacing.lg,
    borderRadius: spacing.md,
    borderWidth: 1,
    marginTop: spacing.vXs,
  },
  infoTitle: {
    fontSize: fontSize.bodyLg,
    marginBottom: spacing.vXs,
  },
  infoText: {
    fontSize: fontSize.caption,
    lineHeight: spacing.vLg,
  },
  errorTestButton: {
    width: "100%",
    paddingVertical: spacing.vMd,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.vSm,
    marginBottom: spacing.vXxl,
  },
  errorTestButtonText: {
    fontSize: fontSize.body,
  },
});
