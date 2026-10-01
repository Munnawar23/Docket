import { AppText } from "@/components/ui/AppText";
import type { Note, NoteCardProps } from "@/types";
import { rs } from "@/helpers/responsiveHelper";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Haptics } from "@/lib/haptics";
import { spacing, type ThemeColors, type ThemeSpacing } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useCallback, useMemo } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import Animated, { Easing, FadeInDown, LinearTransition } from "react-native-reanimated";

export type { NoteCardProps };

export const NoteCard = React.memo(function NoteCard({
  note,
  index = 0,
  isSelected = false,
  isSelectionMode = false,
  onPress,
  onLongPress,
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

  const handleLongPress = useCallback(() => {
    Haptics.medium();
    onLongPress?.(note);
  }, [note, onLongPress]);

  // Three natural height profiles:
  // 1. Very big: has image + title + 3 lines of snippet
  // 2. Medium: no image, but longer text content (up to 6 lines)
  // 3. Small: no image, short text (1-2 lines)
  const maxContentLines = note.imageUrl ? 2 : 4;

  const contentAreaStyle = note.imageUrl
    ? styles.contentAreaWithImage
    : styles.contentArea;

  const displayDate = useMemo(() => {
    if (note.date) return note.date;
    if (note.createdAt) {
      const d = new Date(note.createdAt);
      if (!isNaN(d.getTime())) {
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${m}/${day}`;
      }
    }
    return null;
  }, [note.date, note.createdAt]);

  const getCardStyle = useCallback(
    ({ pressed }: { pressed: boolean }) => [
      styles.card,
      isSelected ? styles.cardSelected : null,
      pressed ? styles.cardActive : null,
    ],
    [styles.card, styles.cardSelected, styles.cardActive, isSelected],
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
      layout={LinearTransition.duration(280)}
      style={style ? [styles.cardWrapper, style] : styles.cardWrapper}
    >
      <Pressable
        onPress={handlePress}
        onLongPress={handleLongPress}
        delayLongPress={280}
        style={getCardStyle}
      >
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
              variant="bodyLg"
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
              variant="bodySm"
              numberOfLines={maxContentLines}
              style={styles.content}
            >
              {note.content}
            </AppText>
          )}

          {/* Footer: Date Badge & Pin Indicator */}
          {(Boolean(displayDate) || Boolean(note.isPinned)) && (
            <View style={styles.footerRow}>
              {Boolean(displayDate) && (
                <View style={styles.dateBadge}>
                  <AppText variant="caption" style={styles.dateText}>
                    {displayDate}
                  </AppText>
                </View>
              )}
              {Boolean(note.isPinned) && (
                <View style={styles.pinBadge}>
                  <Ionicons name="pin" size={rs.icon(11)} color={colors.primary} />
                </View>
              )}
            </View>
          )}
        </View>

        {/* Selection Checkmark Badge (Bottom Right) */}
        {isSelectionMode && (
          <View
            style={[
              styles.selectionBadge,
              isSelected
                ? styles.selectionBadgeSelected
                : styles.selectionBadgeUnselected,
            ]}
          >
            {isSelected && (
              <Ionicons name="checkmark" size={rs.icon(12)} color="#FFFFFF" />
            )}
          </View>
        )}
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
      borderColor: colors.border,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: spacing.vXs },
      shadowOpacity: isDark ? 0.3 : 0.07,
      shadowRadius: spacing.sm,
      elevation: isDark ? 0 : 2,
    },
    cardSelected: {
      borderColor: colors.primary,
      borderWidth: 1,
    },
    cardActive: {
      opacity: 0.88,
      transform: [{ scale: 0.98 }],
    },
    selectionBadge: {
      position: "absolute",
      bottom: spacing.sm,
      right: spacing.sm,
      width: rs.space(22),
      height: rs.space(22),
      borderRadius: rs.space(11),
      alignItems: "center",
      justifyContent: "center",
      zIndex: 20,
      borderWidth: 1.5,
    },
    selectionBadgeSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.card,
    },
    selectionBadgeUnselected: {
      backgroundColor: colors.card,
      borderColor: colors.border,
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
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      alignSelf: "flex-start",
    },
    dateText: {
      color: colors.subtext,
      letterSpacing: 0.2,
    },
    pinBadge: {
      paddingHorizontal: spacing.xs,
      paddingVertical: spacing.vXs / 2,
      borderRadius: spacing.sm,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      alignSelf: "flex-start",
      alignItems: "center",
      justifyContent: "center",
    },
  });
