import { rs } from "@/helpers/responsive.utils";

export const spacing = {
  xs: rs.space(4),
  sm: rs.space(8),
  md: rs.space(12),
  lg: rs.space(16),
  xl: rs.space(20),
  xxl: rs.space(24),
  xxxl: rs.space(32),

  vXs: rs.space(4),
  vSm: rs.space(8),
  vMd: rs.space(12),
  vLg: rs.space(16),
  vXl: rs.space(20),
  vXxl: rs.space(24),
  vXxxl: rs.space(32),

  // Semantic layout tokens
  screenPadding: rs.space(16),
  sectionHeaderTop: rs.space(16),
  sectionHeaderBottom: rs.space(10),
  cardMarginTop: rs.space(6),
  cardMarginBottom: rs.space(16),
  itemGap: rs.space(8),

  // Icon sizes
  iconSm: rs.icon(18),
  iconMd: rs.icon(24),
  iconLg: rs.icon(36),

  // Component sizes
  avatarMd: rs.space(48),
  avatarLg: rs.space(68),
};

export type ThemeSpacing = typeof spacing;
