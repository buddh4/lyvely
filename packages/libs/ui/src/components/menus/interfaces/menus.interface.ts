import { Translatable } from '@/i18n';
import { IconOptionsIF } from '@/components/icons';
import { RouteLocationRaw } from 'vue-router';
import { ComputedRef, Ref } from 'vue';

export interface IconBindingsIf {
  title?: Translatable;
  options?: IconOptionsIF;
  scaleTo?: number;
  class?: string;
  autoScale?: boolean;
}

export interface IBaseMenuEntry<TContext = any> {
  id: string;
  icon?: string;
  iconBindings?: IconBindingsIf;
  moduleId: string;
  text?: Translatable;
  condition?:
    | boolean
    | Ref<boolean>
    | ComputedRef<boolean>
    | ((context: TContext) => Ref<boolean> | ComputedRef<boolean> | boolean);
  to?: RouteLocationRaw;
  feature?: string;
  sortOrder?: number;
  click?: { (): void };
}

export interface IRouteMenuEntry<TContext = any> extends IBaseMenuEntry<TContext> {
  to: RouteLocationRaw;
}

export interface IClickMenuEntry<TContext = any> extends IBaseMenuEntry<TContext> {
  click: { (): void };
}

export type IMenuEntry<TContext = any> = IRouteMenuEntry<TContext> | IClickMenuEntry<TContext>;
