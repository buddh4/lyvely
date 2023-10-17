import { ComponentRegistration } from '@/ui/interfaces';

export interface IComponentStackEntry<IProps = any> {
  id: string;
  component: ComponentRegistration<IProps>;
  props?: IProps;
}
