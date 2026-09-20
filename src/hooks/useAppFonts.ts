import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

// Prevent splash screen from auto-hiding while resources load
SplashScreen.preventAutoHideAsync().catch(() => {});

export function useAppFonts() {
  const [fontsLoaded, fontError] = useFonts({
    "PlusJakartaSans-Regular": require("../../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "PlusJakartaSans-Medium": require("../../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "PlusJakartaSans-SemiBold": require("../../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "PlusJakartaSans-Bold": require("../../assets/fonts/PlusJakartaSans-Bold.ttf"),
  });

  const isReady = fontsLoaded || !!fontError;

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [isReady]);

  return {
    fontsLoaded: isReady,
    fontError,
  };
}
