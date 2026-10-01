import { MOCK_NOTES } from "@/constants";
import type { Note } from "@/types";
import { verticalScale } from "@/helpers/responsiveHelper";
import { useAppSafeArea } from "@/hooks/useAppSafeArea";
import { Haptics } from "@/lib/haptics";
import { useCallback, useMemo, useState } from "react";
import { Dimensions, LayoutChangeEvent } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  type WithSpringConfig,
} from "react-native-reanimated";
import { scheduleOnRN, scheduleOnUI } from "react-native-worklets";

export type HomeTab = "notes" | "tasks";

export const HOME_TABS = [
  { label: "Notes", value: "notes" },
  { label: "Tasks", value: "tasks" },
];

const SCREEN_WIDTH = Dimensions.get("window").width;

const PAGE_SPRING_CONFIG: WithSpringConfig = {
  mass: 0.8,
  damping: 26,
  stiffness: 240,
  overshootClamping: false,
};

export function useHomeScreen() {
  const [activeTab, setActiveTab] = useState<HomeTab>("notes");
  const { bottom } = useAppSafeArea();

  // Notes data and multi-select state
  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES);
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);
  const isSelectionMode = selectedNoteIds.length > 0;

  // Keep pageWidth on the UI thread — gesture handlers read it without bridging
  const pageWidth = useSharedValue(SCREEN_WIDTH);
  const contentTranslateX = useSharedValue(0);
  const startTranslateX = useSharedValue(0);
  const currentTabIndex = useSharedValue(0);

  const handleSwipeTabChange = useCallback((newTab: HomeTab) => {
    setActiveTab((prev) => {
      if (prev !== newTab) {
        Haptics.light();
        return newTab;
      }
      return prev;
    });
  }, []);

  const swipeGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-15, 15])
        .failOffsetY([-15, 15])
        .onBegin(() => {
          "worklet";
          startTranslateX.value = contentTranslateX.value;
        })
        .onUpdate((event) => {
          "worklet";
          const w = pageWidth.value;
          if (w <= 0) return;
          const raw = startTranslateX.value + event.translationX;
          if (raw > 0) {
            contentTranslateX.value = raw * 0.2;
          } else if (raw < -w) {
            contentTranslateX.value = -w + (raw + w) * 0.2;
          } else {
            contentTranslateX.value = raw;
          }
        })
        .onFinalize((event, success) => {
          "worklet";
          const w = pageWidth.value;
          if (w <= 0) return;

          if (!success) {
            contentTranslateX.value = withSpring(
              -currentTabIndex.value * w,
              PAGE_SPRING_CONFIG
            );
            return;
          }

          const progress = -contentTranslateX.value / w;
          let targetIndex = Math.round(progress);
          if (event.velocityX < -400) targetIndex = 1;
          else if (event.velocityX > 400) targetIndex = 0;
          targetIndex = Math.max(0, Math.min(1, targetIndex));
          contentTranslateX.value = withSpring(-targetIndex * w, PAGE_SPRING_CONFIG);

          if (targetIndex !== currentTabIndex.value) {
            currentTabIndex.value = targetIndex;
            const newTab: HomeTab = targetIndex === 0 ? "notes" : "tasks";
            scheduleOnRN(handleSwipeTabChange, newTab);
          }
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] // shared values are stable refs — safe to omit
  );

  // Tab-bar press: run entirely on UI thread to avoid reading .value on JS thread
  const handleTabPress = (val: HomeTab) => {
    const targetIndex = val === "notes" ? 0 : 1;
    currentTabIndex.value = targetIndex;
    scheduleOnUI(() => {
      "worklet";
      contentTranslateX.value = withSpring(
        -targetIndex * pageWidth.value,
        PAGE_SPRING_CONFIG
      );
    });
    setActiveTab(val);
  };

  const onContentLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w <= 0) return;
    const snapIndex = activeTab === "tasks" ? 1 : 0;
    currentTabIndex.value = snapIndex;
    scheduleOnUI(() => {
      "worklet";
      if (w === pageWidth.value) return;
      pageWidth.value = w;
      // Snap to current tab position without animation on layout change
      contentTranslateX.value = -snapIndex * w;
    });
  };

  const animatedPageStyle = useAnimatedStyle(() => ({
    width: pageWidth.value * 2,
    transform: [{ translateX: contentTranslateX.value }],
  }));

  // Selection handlers
  const handleToggleSelectNote = useCallback((note: Note) => {
    Haptics.light();
    setSelectedNoteIds((prev) => {
      if (prev.includes(note.id)) {
        return prev.filter((id) => id !== note.id);
      }
      return [...prev, note.id];
    });
  }, []);

  const handleNoteLongPress = useCallback((note: Note) => {
    Haptics.medium();
    setSelectedNoteIds((prev) => {
      if (prev.includes(note.id)) {
        return prev;
      }
      return [...prev, note.id];
    });
  }, []);

  const handleDeleteSelected = useCallback(() => {
    Haptics.medium();
    setNotes((prev) => prev.filter((n) => !selectedNoteIds.includes(n.id)));
    setSelectedNoteIds([]);
  }, [selectedNoteIds]);

  const handlePinSelected = useCallback(() => {
    Haptics.light();
    console.log("[HomeScreen] Pinned notes:", selectedNoteIds);
    setSelectedNoteIds([]);
  }, [selectedNoteIds]);

  const handleArchiveSelected = useCallback(() => {
    Haptics.light();
    setNotes((prev) => prev.filter((n) => !selectedNoteIds.includes(n.id)));
    setSelectedNoteIds([]);
  }, [selectedNoteIds]);

  const handleCancelSelection = useCallback(() => {
    Haptics.light();
    setSelectedNoteIds([]);
  }, []);

  const floatingBottom = Math.max(bottom, verticalScale(16)) + verticalScale(22);

  return {
    activeTab,
    swipeGesture,
    handleTabPress,
    onContentLayout,
    animatedPageStyle,
    floatingBottom,
    // Notes & Selection State
    notes,
    setNotes,
    selectedNoteIds,
    isSelectionMode,
    handleToggleSelectNote,
    handleNoteLongPress,
    handleDeleteSelected,
    handlePinSelected,
    handleArchiveSelected,
    handleCancelSelection,
  };
}
