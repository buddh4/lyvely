import { ComponentRegistration } from '@/ui/interfaces';

export interface ILayout<IProps = any> {
  id: string;
  component: ComponentRegistration<IProps>;
  props: IProps;
}

const layoutMap = new Map<string, ILayout>();

export function registerLayouts(layouts: ILayout[]) {
  layouts.forEach((l) => registerLayout(l));
}

export function registerLayout(layout: ILayout) {
  layoutMap.set(layout.id, layout);
}

export function getLayout(id: string) {
  return layoutMap.get(id);
}
