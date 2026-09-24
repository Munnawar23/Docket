export const lightColors = {
  // OnePlus OxygenOS light: clean white canvas, very subtle off-white cards
  background: "#F2F2F2",
  card: "#FFFFFF",
  text: "#0D0D0D",
  subtext: "#888888",
  primary: "#EB0029",
  border: "#E0E0E0",
};

export const darkColors = {
  // OnePlus OxygenOS dark: OLED true black, dark charcoal cards
  background: "#000000",
  card: "#1A1A1A",
  text: "#FFFFFF",
  subtext: "#888888",
  primary: "#EB0029",
  border: "#2A2A2A",
};

// ─── Aesthetic Themes (standalone — no dark/light variant) ───────────────────

export const roseColors = {
  background: "#FFF0F5",
  card: "#FFE4EE",
  text: "#4A1230",
  subtext: "#9D5070",
  primary: "#F43F8E",
  border: "#FBCFE8",
};

export const skyColors = {
  background: "#F0F8FF",
  card: "#E0F2FF",
  text: "#0C3A5F",
  subtext: "#4A7FA5",
  primary: "#38BDF8",
  border: "#BAE6FD",
};

export const butterColors = {
  background: "#FFFEF7",
  card: "#FFFDF0",
  text: "#1C1917",
  subtext: "#78716C",
  primary: "#FAD02C",
  border: "#FEF3C7",
};

export type ThemeColors = typeof lightColors;
