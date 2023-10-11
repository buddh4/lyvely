import { Translatable } from '@/i18n';
import { RouteLocationRaw } from 'vue-router';

export interface IBaseMenuEntry {
  id: string;
  icon?: string;
  title: Translatable;
  condition?: () => boolean;
  to?: RouteLocationRaw;
  feature?: string;
  sortOrder?: number;
  click?: { (): void };
}

export interface IRouteMenuEntry extends IBaseMenuEntry {
  to: RouteLocationRaw;
}

export interface IClickMenuEntry extends IBaseMenuEntry {
  click: { (): void };
}

export type IMenuEntry = IRouteMenuEntry | IClickMenuEntry;
