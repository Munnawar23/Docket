import { AppText } from "@/components/ui/AppText";
import { EmptyState } from "@/components/ui/EmptyState";
import { MOCK_NOTES, type Note } from "@/constants";
import { useAppSafeArea } from "@/hooks/useAppSafeArea";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Haptics } from "@/lib/haptics";
import { spacing, type ThemeSpacing } from "@/theme";
import { FlashList } from "@shopify/flash-list";
import React, { useCallback, useMemo, useState } from "react";
import { RefreshControl, StyleSheet, View } from "react-native";
import { NoteCard } from "../components/NoteCard";

// Clearance for the floating bottom navigation bar
const BOTTOM_BAR_CLEARANCE = spacing.xxxl * 3 + spacing.lg;

export const NotesListScreen = React.memo(function NotesListScreen() {
  const { colors } = useAppTheme();
  const { bottom } = useAppSafeArea();
  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES);
  const [refreshing, setRefreshing] = useState(false);

  const styles = useMemo(() => createStyles(spacing), []);

  const handleRefresh = useCallback(() => {
    Haptics.light();
    setRefreshing(true);
    setTimeout(() => {
      // Refresh / reload mock data
      setNotes([...MOCK_NOTES]);
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleNotePress = useCallback((note: Note) => {
    console.log("[NotesListScreen] Note pressed:", note.title);
  }, []);

  const renderNoteItem = useCallback(
    ({ item, index }: { item: Note; index: number }) => (
      <View style={styles.cardItemWrapper}>
        <NoteCard note={item} index={index} onPress={handleNotePress} />
      </View>
    ),
    [handleNotePress, styles.cardItemWrapper],
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

  const renderEmpty = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <EmptyState
          iconFamily="Ionicons"
          iconName="document-text-outline"
          iconColor={colors.primary}
          title="No notes yet"
          description="Capture your thoughts and ideas."
        />
      </View>
    ),
    [colors.primary, styles.emptyContainer],
  );

  const bottomPadding = Math.max(bottom, spacing.screenPadding) + BOTTOM_BAR_CLEARANCE;

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
        ListEmptyComponent={renderEmpty}
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
      paddingTop: spacing.sm,
    },
    titleContainer: {
      paddingHorizontal: spacing.xs,
      paddingTop: spacing.vXs,
      paddingBottom: spacing.sm,
    },
    cardItemWrapper: {
      paddingHorizontal: spacing.xs,
      paddingBottom: spacing.itemGap,
    },
    emptyContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: spacing.screenPadding,
      paddingTop: spacing.xxxl * 2,
      paddingBottom: spacing.xxxl * 2,
    },
  });
