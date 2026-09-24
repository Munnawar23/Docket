import { Dimensions, PixelRatio } from "react-native";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

export const width = SCREEN_W;
export const height = SCREEN_H;

const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

const _scaleW = (size: number): number => (SCREEN_W / BASE_WIDTH) * size;
const _scaleH = (size: number): number => (SCREEN_H / BASE_HEIGHT) * size;

const _moderate = (size: number, factor: number): number =>
  size + (_scaleW(size) - size) * factor;

const _capped = (size: number, factor: number, cap = 1.35): number =>
  Math.min(_moderate(size, factor), size * cap);

export const rs = {
  font: (size: number): number => Math.round(_capped(size, 0.5)),
  space: (size: number): number => Math.round(_capped(size, 0.3)),
  icon: (size: number): number => Math.round(_capped(size, 0.4)),
};

export const lineHeight = (fontSize: number, ratio = 1.4): number =>
  Math.round(rs.font(fontSize) * ratio);

export const fSize = rs.font;

export const wp = (val: string | number): number => {
  const p = typeof val === "string" ? parseFloat(val) : val;
  return PixelRatio.roundToNearestPixel((SCREEN_W * p) / 100);
};

export const hp = (val: string | number): number => {
  const p = typeof val === "string" ? parseFloat(val) : val;
  return PixelRatio.roundToNearestPixel((SCREEN_H * p) / 100);
};

export const scale = (size: number): number => _scaleW(size);

export const verticalScale = (size: number): number => _scaleH(size);
