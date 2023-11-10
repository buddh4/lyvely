import { ComponentRegistration } from '@/types';
import { ComputedRef, Ref } from 'vue';

export interface IComponentStackEntry<TProps = any> {
  id: string;
  component: ComponentRegistration<TProps>;
  condition?: Ref<boolean> | ComputedRef<boolean>;
  sortOrder?: number;
  props?: TProps;
}
