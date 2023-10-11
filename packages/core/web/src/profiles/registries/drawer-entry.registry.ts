import { Translatable } from '@/i18n';
import { RouteLocationRaw } from 'vue-router';

export interface IMenuEntry {
  icon: string;
  title: Translatable;
  to: RouteLocationRaw;
}
