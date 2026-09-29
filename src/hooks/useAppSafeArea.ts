import {
  useSafeAreaInsets,
  type EdgeInsets,
} from "react-native-safe-area-context";

export interface AppSafeAreaInsets extends EdgeInsets {
  insets: EdgeInsets;
  hasNotch: boolean;
  hasHomeIndicator: boolean;
}

export function useAppSafeArea(): AppSafeAreaInsets {
  const insets = useSafeAreaInsets();

  return {
    top: insets.top,
    bottom: insets.bottom,
    left: insets.left,
    right: insets.right,
    insets,
    hasNotch: insets.top > 20,
    hasHomeIndicator: insets.bottom > 0,
  };
}

export const useSafeArea = useAppSafeArea;
export default useAppSafeArea;
