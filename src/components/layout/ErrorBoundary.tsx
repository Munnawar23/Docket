import React, { Component, useMemo, type ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Haptics } from "@/lib/haptics";
import { useAppTheme } from "@/hooks/useAppTheme";
import { fontSize, spacing } from "@/theme/theme";
import type { ThemeColors } from "@/theme/colors";
import type { ThemeFontFamily } from "@/theme/typography";
import { ThemeBackground } from "../ThemeBackground";
import { Button } from "../common/Button";

type Props = { children: ReactNode };
type State = { hasError: boolean };

class ErrorBoundaryClass extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("[ErrorBoundary]:", error);
  }

  reset = () => {
    Haptics.medium();
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return <ErrorScreen onReset={this.reset} />;
    }
    return this.props.children;
  }
}

function ErrorScreen({ onReset }: { onReset: () => void }) {
  const { colors, fontFamily } = useAppTheme();
  const styles = useMemo(() => createStyles(colors, fontFamily), [colors, fontFamily]);

  return (
    <ThemeBackground style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconBox}>
          <Ionicons name="warning-outline" size={spacing.iconLg} color={colors.primary} />
        </View>
        <Text style={styles.title}>Something Went Wrong</Text>
        <Text style={styles.subtitle}>
          An unexpected error occurred. You can try resetting the current view.
        </Text>
        <Button
          title="Try Again"
          icon="refresh-outline"
          onPress={onReset}
          style={styles.button}
        />
      </View>
    </ThemeBackground>
  );
}

export const ErrorBoundary = ErrorBoundaryClass;
export default ErrorBoundary;

const createStyles = (colors: ThemeColors, fontFamily: ThemeFontFamily) =>
  StyleSheet.create({
    container: { flex: 1 },
    content: {
      flex: 1,
      paddingHorizontal: spacing.xl,
      alignItems: "center",
      justifyContent: "center",
    },
    iconBox: {
      width: spacing.avatarLg,
      height: spacing.avatarLg,
      borderRadius: spacing.avatarLg / 2,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing.vLg,
      backgroundColor: colors.card,
      borderColor: colors.border,
    },
    title: {
      textAlign: "center",
      marginBottom: spacing.vSm,
      fontSize: fontSize.heading,
      color: colors.text,
      fontFamily: fontFamily.heading,
    },
    subtitle: {
      textAlign: "center",
      marginBottom: spacing.vXl,
      fontSize: fontSize.body,
      lineHeight: fontSize.body * 1.5,
      color: colors.text,
      fontFamily: fontFamily.text,
    },
    button: {
      minWidth: spacing.avatarLg * 2,
    },
  });
