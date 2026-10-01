import { AppText } from "@/components/ui/AppText";
import type { Note } from "@/constants";
import { rs } from "@/helpers/responsiveHelper";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Haptics } from "@/lib/haptics";
import { spacing, type ThemeColors, type ThemeSpacing } from "@/theme";
import { Image } from "expo-image";
import React, { useCallback, useMemo } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import Animated, { Easing, FadeInDown } from "react-native-reanimated";

export interface NoteCardProps {
  note: Note;
  index?: number;
  onPress?: (note: Note) => void;
  style?: StyleProp<ViewStyle>;
}

export const NoteCard = React.memo(function NoteCard({
  note,
  index = 0,
  onPress,
  style,
}: NoteCardProps) {
  const { colors, isDark, isAestheticTheme } = useAppTheme();

  const styles = useMemo(
    () => createStyles(colors, spacing, isDark, isAestheticTheme),
    [colors, isDark, isAestheticTheme],
  );

  const handlePress = useCallback(() => {
    Haptics.light();
    onPress?.(note);
  }, [note, onPress]);

  // Three natural height profiles:
  // 1. Very big: has image + title + 3 lines of snippet
  // 2. Medium: no image, but longer text content (up to 6 lines)
  // 3. Small: no image, short text (1-2 lines)
  const maxContentLines = note.imageUrl ? 2 : 4;

  const contentAreaStyle = note.imageUrl
    ? styles.contentAreaWithImage
    : styles.contentArea;

  const getCardStyle = useCallback(
    ({ pressed }: { pressed: boolean }) =>
      pressed ? styles.cardActive : styles.card,
    [styles.card, styles.cardActive],
  );

  const enteringAnimation = useMemo(
    () =>
      FadeInDown.delay(index * 80)
        .duration(650)
        .easing(Easing.out(Easing.cubic))
        .withInitialValues({
          transform: [{ translateY: 45 }],
          opacity: 0,
        }),
    [index],
  );

  return (
    <Animated.View
      entering={enteringAnimation}
      style={style ? [styles.cardWrapper, style] : styles.cardWrapper}
    >
      <Pressable onPress={handlePress} style={getCardStyle}>
        {/* Optional Top Image */}
        {Boolean(note.imageUrl) && (
          <Image
            source={{ uri: note.imageUrl! }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
        )}

        {/* Text Details Area */}
        <View style={contentAreaStyle}>
          {/* Note Title */}
          {Boolean(note.title) && (
            <AppText
              variant="title"
              semiBold
              numberOfLines={2}
              style={styles.title}
            >
              {note.title}
            </AppText>
          )}

          {/* Note Content / Snippet */}
          {Boolean(note.content) && (
            <AppText
              variant="caption"
              numberOfLines={maxContentLines}
              style={styles.content}
            >
              {note.content}
            </AppText>
          )}

          {/* Footer: Date Badge */}
          {Boolean(note.date) && (
            <View style={styles.footerRow}>
              <View style={styles.dateBadge}>
                <AppText variant="caption" style={styles.dateText}>
                  {note.date}
                </AppText>
              </View>
            </View>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
});

export default NoteCard;

const createStyles = (
  colors: ThemeColors,
  spacing: ThemeSpacing,
  isDark: boolean,
  isAestheticTheme: boolean,
) =>
  StyleSheet.create({
    cardWrapper: {
      width: "100%",
    },
    card: {
      width: "100%",
      backgroundColor: colors.card,
      borderRadius: spacing.xl,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: isAestheticTheme
        ? `${colors.border}B3`
        : `${colors.border}80`,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: spacing.vXs },
      shadowOpacity: isDark ? 0.3 : 0.07,
      shadowRadius: spacing.sm,
      elevation: isDark ? 0 : 2,
    },
    cardActive: {
      width: "100%",
      backgroundColor: colors.card,
      borderRadius: spacing.xl,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: isAestheticTheme
        ? `${colors.border}B3`
        : `${colors.border}80`,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: spacing.vXs },
      shadowOpacity: isDark ? 0.3 : 0.07,
      shadowRadius: spacing.sm,
      elevation: isDark ? 0 : 2,
      opacity: 0.88,
      transform: [{ scale: 0.98 }],
    },
    image: {
      width: "100%",
      height: rs.space(110),
      backgroundColor: colors.border,
    },
    contentArea: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.vSm,
      paddingBottom: spacing.vSm,
    },
    contentAreaWithImage: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.vXs,
      paddingBottom: spacing.vSm,
    },
    title: {
      color: colors.text,
      marginBottom: spacing.vXs,
    },
    content: {
      color: colors.subtext,
      marginBottom: spacing.vXs,
    },
    footerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
      marginTop: spacing.vXs,
    },
    dateBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.vXs / 2,
      borderRadius: spacing.sm,
      backgroundColor: isAestheticTheme
        ? `${colors.border}80`
        : `${colors.border}66`,
      alignSelf: "flex-start",
    },
    dateText: {
      color: colors.subtext,
      letterSpacing: 0.2,
    },
  });
