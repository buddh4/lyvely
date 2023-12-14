import { ComponentRegistration } from '@/types';
import { ComputedRef, Ref } from 'vue';

export interface IComponentStackEntry<
  TProps = any,
  TOn extends Record<string, (...args: any[]) => void> = Record<string, (...args: any[]) => void>,
> {
  id: string;
  component: ComponentRegistration<TProps>;
  condition?: Ref<boolean> | ComputedRef<boolean>;
  sortOrder?: number;
  props?: TProps;
  on?: TOn;
}
