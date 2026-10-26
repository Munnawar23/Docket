// Claude-inspired warm parchment (light) & deep obsidian terracotta (dark) color palette

export const lightColors = {
  background: "#FBF7ED", // Claude signature warm parchment/cream background
  card: "#FFFFFF",       // Clean card surface
  text: "#2B2625",       // Deep warm charcoal (soft on eyes, not harsh pure black)
  subtext: "#7D7571",    // Warm muted clay / stone gray
  primary: "#D97706",    // Claude signature warm terracotta orange / amber (#D97706 / #CC5500)
  border: "#EBE3D5",     // Soft warm parchment divider
};

export const darkColors = {
  background: "#1E1A17", // Deep warm charcoal/espresso dark background
  card: "#292420",       // Elevated warm slate surface
  text: "#F5EFE6",       // Soft off-white / parchment reading text
  subtext: "#A39992",    // Warm taupe / secondary text
  primary: "#F59E0B",    // Glowing Claude amber / warm terracotta accent
  border: "#3B342F",     // Subtle warm border divider
};

export type ThemeColors = typeof lightColors;
