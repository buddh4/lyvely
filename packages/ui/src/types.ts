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
