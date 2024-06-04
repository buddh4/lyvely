declare module '@ckpack/vue-color' {
  import type { Component } from '@vue/runtime-core';
  const Alpha: Component;
  const Checkboard: Component;
  const Chrome: Component;
  const Compact: Component;
  const EditableInput: Component;
  const Grayscale: Component;
  const Hue: Component;
  const Material: Component;
  const Photoshop: Component;
  const Saturation: Component;
  const Sketch: Component;
  const Slider: Component;
  const Swatches: Component;
  const Twitter: Component;
}

// Type definitions for vue-virtual-scroller
// Project: https://github.com/Akryum/vue-virtual-scroller/
declare module 'vue-virtual-scroller' {
  import Vue, { ComponentOptions, PluginObject, Component } from 'vue';
  interface PluginOptions {
    installComponents?: boolean;
    componentsPrefix?: string;
  }

  const plugin: PluginObject<PluginOptions> & { version: string };

  export const RecycleScroller: Component<any, any, any, any>;
  export const DynamicScroller: Component<any, any, any, any> & {
    scrollToItem: (index: number) => void;
  };
  export const DynamicScrollerItem: Component<any, any, any, any>;

  export function IdState(options?: {
    idProp?: (vm: any) => any;
  }): ComponentOptions<Vue> | typeof Vue;

  export default plugin;
}

declare module '*.svg' {
  const value: any;
  export = value;
}

declare module '*.png' {
  const value: any;
  export = value;
}

