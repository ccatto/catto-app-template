// @catto/ui - Type definitions
import type React from 'react';

export type StyleWidth =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'
  | '7xl'
  | 'full'
  | 'auto';

export type StyleAnimations = 'tada' | 'pulse' | 'bounce' | 'shake' | 'none';

export type FontSizeType =
  | 'xs'
  | 'sm'
  | 'base'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl';

export type FontWeightType =
  | 'thin'
  | 'extralight'
  | 'light'
  | 'normal'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'extrabold'
  | 'black';

export type ThemeType = 'sunset' | 'ocean' | 'forest' | 'midnight';

export type HapticFeedback = 'light' | 'medium' | 'heavy' | 'none';

// Select component option type
export interface SelectOption {
  value: string;
  label: string;
  /** Optional icon to display before the label (emoji, React component, or image) */
  icon?: React.ReactNode;
}
