import { useAppTheme } from "@/hooks/useAppTheme";
import { type ThemeMode } from "@/store/themeStore";
import { fontFamily, fontSize, spacing } from "@/theme/theme";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const {
    colors,
    isDark,
    themeMode,
    setThemeMode,
    activeScheme,
    systemColorScheme,
  } = useAppTheme();

  const handleSelectMode = (mode: ThemeMode) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // safe fallback on platforms without haptics
    }
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
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={[styles.appTitle, { color: colors.text }]}>
            Docket 📋
          </Text>
          <Text style={[styles.appSubtitle, { color: colors.subtext }]}>
            Minimal Notes Theme Demo
          </Text>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: isDark
                  ? "rgba(251, 191, 36, 0.15)"
                  : "rgba(245, 158, 11, 0.15)",
              },
            ]}
          >
            <Text style={[styles.badgeText, { color: colors.primary }]}>
              Active: {activeScheme.toUpperCase()} MODE ({themeMode})
            </Text>
          </View>
        </View>

        {/* 3 Theme Switcher Buttons */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Choose Theme Mode
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
                        color: isSelected
                          ? isDark
                            ? "#121417"
                            : "#FFFFFF"
                          : colors.text,
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
                          ? isDark
                            ? "rgba(18, 20, 23, 0.8)"
                            : "rgba(255, 255, 255, 0.9)"
                          : colors.subtext,
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

        {/* Color Palette List */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
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
                    <Text style={[styles.tokenName, { color: colors.text }]}>
                      {item.name}
                    </Text>
                    <Text style={[styles.tokenHex, { color: colors.primary }]}>
                      {item.hex}
                    </Text>
                  </View>
                  <Text style={[styles.tokenUsage, { color: colors.subtext }]}>
                    {item.usage}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Live Note Card Preview */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
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
                  {
                    backgroundColor: isDark
                      ? "rgba(251, 191, 36, 0.2)"
                      : "rgba(245, 158, 11, 0.15)",
                  },
                ]}
              >
                <Text
                  style={[styles.previewTagText, { color: colors.primary }]}
                >
                  Productivity
                </Text>
              </View>
              <Text style={[styles.previewDate, { color: colors.subtext }]}>
                Today, 3:30 PM
              </Text>
            </View>

            <Text style={[styles.previewTitle, { color: colors.text }]}>
              Design System & Scaled Typography
            </Text>
            <Text style={[styles.previewBody, { color: colors.subtext }]}>
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
          <Text style={[styles.infoTitle, { color: colors.text }]}>
            💾 Persistent State
          </Text>
          <Text style={[styles.infoText, { color: colors.subtext }]}>
            Theme mode changes are automatically saved to storage via{" "}
            <Text
              style={{ color: colors.primary, fontFamily: fontFamily.semiBold }}
            >
              appStorage
            </Text>{" "}
            (Zustand persist).
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? spacing.vXl : 0,
  },
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
    fontFamily: fontFamily.bold,
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
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
    fontFamily: fontFamily.bold,
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: spacing.vXxl,
  },
  sectionTitle: {
    fontSize: fontSize.title,
    fontFamily: fontFamily.semiBold,
    marginBottom: spacing.sectionHeaderBottom,
    letterSpacing: -0.2,
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
    fontFamily: fontFamily.medium,
    marginBottom: 2,
  },
  buttonDesc: {
    fontSize: fontSize.caption - 1,
    fontFamily: fontFamily.regular,
    textAlign: "center",
  },
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
    fontFamily: fontFamily.semiBold,
  },
  tokenHex: {
    fontSize: fontSize.caption,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  tokenUsage: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.regular,
  },
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
    fontFamily: fontFamily.bold,
  },
  previewDate: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.medium,
  },
  previewTitle: {
    fontSize: fontSize.title,
    fontFamily: fontFamily.semiBold,
    marginBottom: spacing.vXs,
    letterSpacing: -0.2,
  },
  previewBody: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
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
    fontFamily: fontFamily.bold,
    marginBottom: spacing.vXs,
  },
  infoText: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.regular,
    lineHeight: spacing.vLg,
  },
});
