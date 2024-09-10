import { LySvgIconDefinitionIF } from './ly-svg-icon-definition.interface';
import { Color } from '@/types';
import { Translatable } from '@/i18n';

export interface IconOptionsIF {
  color?: Omit<Color, 'inverted'>;
  fill?: string;
  name?: string;
  definition: LySvgIconDefinitionIF;
}

export interface IconBindingsIF {
  title?: Translatable;
  options?: IconOptionsIF;
  scaleTo?: number;
  class?: string;
  autoScale?: boolean;
}
