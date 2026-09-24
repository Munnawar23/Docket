import React from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { verticalScale } from "@/helpers/responsive.utils";
import { TabSwitcher, type TabOption } from "@/components/common/TabSwitcher";
import { FAB } from "./FAB";

export interface BottomBarProps {
  tabs: TabOption[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddNote?: () => void;
  onAddTask?: () => void;
  bottomOffset?: number;
  style?: StyleProp<ViewStyle>;
}

export const BottomBar = React.memo(function BottomBar({
  tabs,
  activeTab,
  onTabChange,
  onAddNote,
  onAddTask,
  bottomOffset = verticalScale(24),
  style,
}: BottomBarProps) {
  return (
    <>
      {/* Centered Tab Switcher */}
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
        bottomOffset={bottomOffset}
      />
    </>
  );
});

export default BottomBar;

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 90,
  },
});
