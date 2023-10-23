import { ComponentRegistration } from '@/ui/interfaces';
import { ComputedRef, Ref } from 'vue';

export interface IComponentStackEntry<TProps = any> {
  id: string;
  component: ComponentRegistration<TProps>;
  condition?: Ref<boolean> | ComputedRef<boolean>;
  props?: TProps;
}
