import { IconName } from './ly-svg-icon.registry';
import { LySvgIconDefinitionIF } from './ly-svg-icon-definition.interface';
import { Color } from '@/types';

export interface IconOptionsIF {
  color?: Omit<Color, 'inverted'>;
  fill?: string;
  name?: IconName;
  definition: LySvgIconDefinitionIF;
}
