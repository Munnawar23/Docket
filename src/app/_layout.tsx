import { Stack } from "expo-router";
import { useAppFonts } from "@/hooks/useAppFonts";

export default function RootLayout() {
  const { fontsLoaded } = useAppFonts();

  if (!fontsLoaded) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
