import { ComponentRegistration } from '../interfaces';
import { Component, defineAsyncComponent } from 'vue';
import { Lazy } from '@lyvely/common';

export function resolveComponentRegistration(component: ComponentRegistration<any>) {
  return typeof component === 'function'
    ? defineAsyncComponent(component as Lazy<Component>)
    : component;
}
