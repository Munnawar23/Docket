import { TabSwitcher, type TabOption } from "@/components";
import { hp, wp } from "@/helpers/responsiveHelper";
import React from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { ActionButtons } from "./ActionButtons";
import { FAB } from "./FAB";

// ─── Props ────────────────────────────────────────────────────────────────────

export interface BottomBarProps {
  tabs: TabOption[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddNote?: () => void;
  onAddTask?: () => void;
  onAddImage?: () => void;
  onAddAudio?: () => void;
  bottomOffset?: number;
  style?: StyleProp<ViewStyle>;
  // Selection mode props
  isSelectionMode?: boolean;
  selectedCount?: number;
  onDelete?: () => void;
  onPin?: () => void;
  onArchive?: () => void;
  onCancelSelection?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const BottomBar = React.memo(function BottomBar({
  tabs,
  activeTab,
  onTabChange,
  onAddNote,
  onAddTask,
  onAddImage,
  onAddAudio,
  bottomOffset = hp(3),
  style,
  isSelectionMode = false,
  selectedCount = 0,
  onDelete,
  onPin,
  onArchive,
  onCancelSelection,
}: BottomBarProps) {
  return (
    <>
      {isSelectionMode ? (
        <ActionButtons
          selectedCount={selectedCount}
          onDelete={onDelete}
          onPin={onPin}
          onArchive={onArchive}
          onCancel={onCancelSelection}
          bottomOffset={bottomOffset}
        />
      ) : (
        <>
          {/* Centered Floating Tab Switcher */}
          <View
            pointerEvents="box-none"
            style={[styles.tabBarContainer, { bottom: bottomOffset }, style]}
          >
            <TabSwitcher tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
          </View>

          {/* Floating Action Button */}
          <FAB
            onAddNote={onAddNote}
            onAddTask={onAddTask}
            onAddImage={onAddImage}
            onAddAudio={onAddAudio}
            bottomOffset={bottomOffset}
          />
        </>
      )}
    </>
  );
});

export default BottomBar;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    left: wp(0),
    right: wp(0),
    width: wp(100),
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp(4),
    zIndex: 90,
  },
});
