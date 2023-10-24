import { ComponentRegistration } from '@/ui/interfaces';
import { isLazyComponentRegistration, loadComponentRegistration } from '@/ui';

export interface ILayout<IProps = any> {
  id: string;
  component: ComponentRegistration<IProps>;
  props?: IProps;
}

const layoutMap = new Map<string, ILayout>();

export async function resolveLayoutComponent(id: string) {
  const layout = getLayout(id);
  if (!layout) return;
  if (isLazyComponentRegistration(layout.component)) {
    layout.component = await loadComponentRegistration(layout.component);
  }
}

export function registerLayouts(layouts: ILayout[]) {
  layouts.forEach((l) => registerLayout(l));
}

export function registerLayout(layout: ILayout) {
  layoutMap.set(layout.id, layout);
}

export function getLayout(id: string) {
  return layoutMap.get(id);
}
