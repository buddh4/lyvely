import { IconOptionsIF, Translatable } from '@lyvely/ui';
import { RouteLocationRaw } from 'vue-router';
import { ComputedRef, Ref } from 'vue';

type MenuIcon =
  | {
      name?: string;
      title?: Translatable;
      options?: IconOptionsIF;
      scaleTo?: number;
      autoScale?: boolean;
    }
  | string;

export interface IBaseMenuEntry {
  id: string;
  icon?: MenuIcon | Ref<MenuIcon> | ComputedRef<MenuIcon>;
  moduleId: string;
  text: Translatable | Ref<Translatable> | ComputedRef<Translatable>;
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
