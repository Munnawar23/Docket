import React from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { hp, wp } from "@/helpers/responsiveHelper";
import { spacing } from "@/theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import { TabSwitcher, type TabOption } from "@/components";
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
}: BottomBarProps) {
  const { colors, isDark } = useAppTheme();

  return (
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
