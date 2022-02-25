import { IconDefinition, IconName } from '@/modules/ui/components/icon/Icons';

export enum Color {
  Primary = 'primary',
  Secondary = 'secondary',
  Inverted = 'inverted',
  Warning = 'warning',
  Info = 'info',
  Danger = 'danger',
  Success = 'success'
}

export interface IconOptions {
  color?: Omit<Color, 'inverted'>,
  fill?: string,
  name?: IconName,
  definition: IconDefinition,
}

export enum Size {
  XS = 'xs',
  SM = 'sm',
  LG = 'lg',
  XL = 'XL',
  XL2 = '2XL',
  XL3 = '3XL',
  XL4 = '4XL',
  XL5 = '5XL',
  XL6 = '6XL',
  XL7 = '7XL',
  Full = 'full',
  Prose = 'prose'
}
