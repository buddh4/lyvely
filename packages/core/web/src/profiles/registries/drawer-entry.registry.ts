import { Translatable } from '@lyvely/ui';
import { RouteLocationRaw } from 'vue-router';

export interface IMenuEntry {
  icon: string;
  title: Translatable;
  to: RouteLocationRaw;
}
