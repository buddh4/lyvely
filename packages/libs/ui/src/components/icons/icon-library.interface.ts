import type { IconOptionsIF } from './icon-options.interface';
import type { ComponentRegistration } from '@/types';
import type { Translatable } from '@/i18n';

export interface IconProps {
  name?: string;
  library?: string;
  title?: Translatable;
  options?: IconOptionsIF;
  scaleTo?: number;
  autoScale?: boolean;
}

export interface IconLibraryIF {
  id: string;
  component: ComponentRegistration;
  getBindings(props: IconProps): any;
}