import * as ExpoHaptics from "expo-haptics";

export const Haptics = {
  light: () => {
    ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Light).catch(() => {});
  },
  medium: () => {
    ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Medium).catch(() => {});
  },
  heavy: () => {
    ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Heavy).catch(() => {});
  },
  selection: () => {
    ExpoHaptics.selectionAsync().catch(() => {});
  },
  success: () => {
    ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Success).catch(() => {});
  },
  warning: () => {
    ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Warning).catch(() => {});
  },
  error: () => {
    ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Error).catch(() => {});
  },
};
