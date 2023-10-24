import { ComponentRegistration } from '../interfaces';
import { Component, defineAsyncComponent } from 'vue';
import { Lazy } from '@lyvely/common';

export function resolveComponentRegistration(component: ComponentRegistration) {
  return typeof component === 'function'
    ? defineAsyncComponent(component as Lazy<Component>)
    : component;
}

export function isVueComponent(obj: any): obj is Component {
  return (
    !!obj &&
    (typeof obj.render === 'function' ||
      obj.template !== undefined ||
      typeof obj.setup === 'function')
  );
}

export function isLazyComponentRegistration(obj: any): obj is Lazy<Component> {
  return typeof obj === 'function' && !isVueComponent(obj);
}

export async function loadComponentRegistration(
  registration: ComponentRegistration,
): Promise<Component>;
export async function loadComponentRegistration(
  registration: ComponentRegistration | undefined,
): Promise<Component | undefined> {
  if (!registration) return;

  if (isLazyComponentRegistration(registration)) {
    const componentImport = await registration();
    return componentImport.default;
  }

  return registration;
}
