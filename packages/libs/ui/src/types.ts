import { IconDefinitionIF, IconName } from './components/icons/Icons';

export enum Color {
  Primary = 'primary',
  Secondary = 'secondary',
  Inverted = 'inverted',
  Warning = 'warning',
  Info = 'info',
  Danger = 'danger',
  Success = 'success',
}

export interface IconOptionsIF {
  color?: Omit<Color, 'inverted'>;
  fill?: string;
  name?: IconName;
  definition: IconDefinitionIF;
}

export enum TextSize {
  XS = 'xs',
  SM = 'sm',
  BASE = 'base',
  LG = 'lg',
  XL = 'xl',
  XL2 = '2xl',
  XL3 = '3xl',
  XL4 = '4xl',
  XL5 = '5xl',
  XL6 = '6xl',
  XL7 = '7xl',
}

const textSizeClassMap = {
  [TextSize.XS]: 'text-xs',
  [TextSize.SM]: 'text-sm',
  [TextSize.BASE]: 'text-base',
  [TextSize.LG]: 'text-lg',
  [TextSize.XL]: 'text-xl',
  [TextSize.XL2]: 'text-2xl',
  [TextSize.XL3]: 'text-3xl',
  [TextSize.XL4]: 'text-4xl',
  [TextSize.XL5]: 'text-5xl',
  [TextSize.XL6]: 'text-6xl',
  [TextSize.XL7]: 'text-7xl',
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
