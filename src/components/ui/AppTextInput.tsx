import React, { forwardRef } from 'react';
import {
  TextInput as RNTextInput,
  type TextInputProps,
} from 'react-native';

export type AppTextInputRef = {
  focus: () => void;
  blur: () => void;
  isFocused: () => boolean;
  clear: () => void;
  setSelection: (start: number, end: number) => void;
};

export interface AppTextInputProps extends TextInputProps {}

export const AppTextInput = forwardRef<AppTextInputRef, AppTextInputProps>(
  function AppTextInput({ style, maxFontSizeMultiplier = 1.2, ...rest }, ref) {
    return (
      <RNTextInput
        ref={ref as any}
        maxFontSizeMultiplier={maxFontSizeMultiplier}
        style={style}
        {...rest}
      />
    );
  }
);

export default AppTextInput;
