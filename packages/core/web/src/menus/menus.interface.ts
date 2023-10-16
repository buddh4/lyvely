import { Translatable } from '@lyvely/ui';
import { RouteLocationRaw } from 'vue-router';
import { ComputedRef, Ref } from 'vue';

export interface IBaseMenuEntry {
  id: string;
  icon?: string;
  moduleId: string;
  title: Translatable;
  condition?: Ref<boolean> | ComputedRef<boolean>;
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
