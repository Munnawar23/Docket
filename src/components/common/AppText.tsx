import React from 'react';
import { Text as RNText, type TextProps } from 'react-native';

export interface AppTextProps extends TextProps {
  children?: React.ReactNode;
}

export function AppText({
  style,
  children,
  maxFontSizeMultiplier = 1.2,
  ...rest
}: AppTextProps) {
  return (
    <RNText
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      style={style}
      {...rest}
    >
      {children}
    </RNText>
  );
}

export default AppText;
