import { ComponentRegistration } from '@/ui/interfaces';
import { ComputedRef, Ref } from 'vue';

export interface IComponentStackEntry<IProps = any> {
  id: string;
  component: ComponentRegistration<IProps>;
  condition?: Ref<boolean> | ComputedRef<boolean>;
  props?: IProps;
}
