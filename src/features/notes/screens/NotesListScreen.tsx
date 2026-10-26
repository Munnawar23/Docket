import { AppText } from "@/components/ui/AppText";
import { EmptyState } from "@/components/ui/EmptyState";
import { MOCK_NOTES } from "@/constants";
import { useAppSafeArea } from "@/hooks/useAppSafeArea";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Haptics } from "@/lib/haptics";
import { spacing, type ThemeSpacing } from "@/theme";
import type { Note, NotesListScreenProps } from "@/types";
import { FlashList } from "@shopify/flash-list";
import React, { useCallback, useMemo, useState } from "react";
import { RefreshControl, StyleSheet, View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { NoteCard } from "../components/NoteCard";
import { sortNotes } from "../utils/sortNotes";

// Clearance for the floating bottom navigation bar
const BOTTOM_BAR_CLEARANCE = spacing.xxxl * 3 + spacing.lg;

export type { NotesListScreenProps };

export const NotesListScreen = React.memo(function NotesListScreen({
  notes: controlledNotes,
  selectedNoteIds = [],
  isSelectionMode = false,
  onToggleSelectNote,
  onLongPressNote,
  onNotePress,
  onRefresh,
  refreshing: controlledRefreshing,
}: NotesListScreenProps = {}) {
  const { colors } = useAppTheme();
  const { bottom } = useAppSafeArea();

  const [internalNotes, setInternalNotes] = useState<Note[]>(() =>
    sortNotes(MOCK_NOTES),
  );
  const notes = controlledNotes ?? internalNotes;

  const [internalRefreshing, setInternalRefreshing] = useState(false);
  const refreshing = controlledRefreshing ?? internalRefreshing;

  const styles = useMemo(() => createStyles(spacing), []);

  const handleRefresh = useCallback(() => {
    if (onRefresh) {
      onRefresh();
      return;
    }
    Haptics.light();
    setInternalRefreshing(true);
    setTimeout(() => {
      setInternalRefreshing(false);
    }, 600);
  }, [onRefresh]);

  const handleNotePress = useCallback(
    (note: Note) => {
      onNotePress?.(note);
    },
    [onNotePress],
  );

  const handleNoteLongPress = useCallback(
    (note: Note) => {
      onLongPressNote?.(note);
    },
    [onLongPressNote],
  );

  const renderNoteItem = useCallback(
    ({ item, index }: { item: Note; index: number }) => {
      const isSelected = selectedNoteIds.includes(item.id);
      return (
        <Animated.View
          layout={LinearTransition.duration(280)}
          style={styles.cardItemWrapper}
        >
          <NoteCard
            note={item}
            index={index}
            isSelected={isSelected}
            isSelectionMode={isSelectionMode}
            onPress={handleNotePress}
            onLongPress={handleNoteLongPress}
          />
        </Animated.View>
      );
    },
    [
      handleNotePress,
      handleNoteLongPress,
      selectedNoteIds,
      isSelectionMode,
      styles.cardItemWrapper,
    ],
  );

  const keyExtractor = useCallback((item: Note) => item.id, []);

  const renderHeader = useCallback(
    () => (
      <View style={styles.titleContainer}>
        <AppText variant="largeTitle">Notes</AppText>
      </View>
    ),
    [styles.titleContainer],
  );

  const bottomPadding =
    Math.max(bottom, spacing.screenPadding) + BOTTOM_BAR_CLEARANCE;

  const contentContainerStyle = useMemo(
    () => [styles.listContent, { paddingBottom: bottomPadding }],
    [styles.listContent, bottomPadding],
  );

  return (
    <View style={styles.container}>
      <FlashList
        data={notes}
        renderItem={renderNoteItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        masonry
        optimizeItemArrangement
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.centerEmptyContainer}>
            <EmptyState
              iconFamily="Ionicons"
              iconName="document-text-outline"
              iconColor={colors.primary}
              title="No notes yet"
              description="Capture your thoughts and ideas."
            />
          </View>
        }
        contentContainerStyle={contentContainerStyle}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
            progressBackgroundColor={colors.card}
          />
        }
      />
    </View>
  );
});

export default NotesListScreen;

const createStyles = (spacing: ThemeSpacing) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    listContent: {
      paddingHorizontal: spacing.screenPadding - spacing.xs,
      paddingTop: 0,
    },
    titleContainer: {
      paddingHorizontal: spacing.screenPadding,
      paddingTop: 0,
      paddingBottom: spacing.sm,
    },
    cardItemWrapper: {
      paddingHorizontal: spacing.xs,
      paddingBottom: spacing.itemGap,
    },
    centerEmptyContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: spacing.screenPadding,
      paddingTop: spacing.xxxl * 3,
      paddingBottom: spacing.xxxl * 2,
    },
  });
