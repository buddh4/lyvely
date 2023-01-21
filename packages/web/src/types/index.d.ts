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
declare module "vue-virtual-scroller" {
  import Vue, { ComponentOptions, PluginObject, Component } from "vue";
  interface PluginOptions {
    installComponents?: boolean;
    componentsPrefix?: string;
  }

  const plugin: PluginObject<PluginOptions> & { version: string };

  export const RecycleScroller: Component<any, any, any, any>;
  export const DynamicScroller: Component<any, any, any, any> & { scrollToItem: ((index: number) => void) };
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

declare module 'virtual:pwa-register/vue' {
  // @ts-expect-error ignore when vue is not installed
  import type { Ref } from 'vue'

  export interface RegisterSWOptions {
    immediate?: boolean
    onNeedRefresh?: () => void
    onOfflineReady?: () => void
    /**
     * Called only if `onRegisteredSW` is not provided.
     *
     * @deprecated Use `onRegisteredSW` instead.
     * @param registration The service worker registration if available.
     */
    onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void
    /**
     * Called once the service worker is registered (requires version `0.12.8+`).
     *
     * @param swScriptUrl The service worker script url.
     * @param registration The service worker registration if available.
     */
    onRegisteredSW?: (swScriptUrl: string, registration: ServiceWorkerRegistration | undefined) => void
    onRegisterError?: (error: any) => void
  }

  export function useRegisterSW(options?: RegisterSWOptions): {
    needRefresh: Ref<boolean>
    offlineReady: Ref<boolean>
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>
  }
}
