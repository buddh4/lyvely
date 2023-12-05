import { Translatable } from '@/i18n';
import { IconOptionsIF } from '@/types';
import { RouteLocationRaw } from 'vue-router';

export interface IconBindingsIf {
    title?: Translatable;
    options?: IconOptionsIF;
    scaleTo?: number;
    class?: string;
    autoScale?: boolean;
}

export interface IBaseMenuEntry {
  id: string;
  icon?: string;
  iconBindings?: IconBindingsIf;
  moduleId: string;
  text: Translatable;
  condition?: boolean;
  to?: RouteLocationRaw;
  features?: string[] | string;
  sortOrder?: number;
  click?: { (): void };
}

export interface IRouteMenuEntry extends IBaseMenuEntry {
  to: RouteLocationRaw;
}

export interface IClickMenuEntry extends IBaseMenuEntry {
  click: { (): void };
}

export type IMenuEntry = IRouteMenuEntry | IClickMenuEntry
