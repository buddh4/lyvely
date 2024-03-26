import { LySvgIconDefinitionIF, IconName } from './components/icons/registries';
import { Component } from 'vue';
import { Lazy } from '@lyvely/common';

export enum Color {
  Primary = 'primary',
  Secondary = 'secondary',
  Inverted = 'inverted',
  Warning = 'warning',
  Info = 'info',
  Danger = 'danger',
  Success = 'success',
}

export type ComponentRegistration<Props = any> = Component<Props> | Lazy<Component<Props>>;

export interface IconOptionsIF {
  color?: Omit<Color, 'inverted'>;
  fill?: string;
  name?: IconName;
  definition: LySvgIconDefinitionIF;
}

export type TextSize =
  | 'xs'
  | 'sm'
  | 'base'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'
  | '7xl';

const textSizeClassMap = {
  ['xs']: 'text-xs',
  ['sm']: 'text-sm',
  ['base']: 'text-base',
  ['lg']: 'text-lg',
  ['xl']: 'text-xl',
  ['2xl']: 'text-2xl',
  ['3xl']: 'text-3xl',
  ['4xl']: 'text-4xl',
  ['5xl']: 'text-5xl',
  ['6xl']: 'text-6xl',
  ['7xl']: 'text-7xl',
};

export const getTextSizeClass = (size: TextSize): string => {
  return textSizeClassMap[size] as string;
};

export enum Size {
  XS = 'xs',
  SM = 'sm',
  LG = 'lg',
  XL = 'xl',
  XL2 = '2xl',
  XL3 = '3xl',
  XL4 = '4xl',
  XL5 = '5xl',
  XL6 = '6xl',
  XL7 = '7xl',
  Full = 'full',
  Prose = 'prose',
}
