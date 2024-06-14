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

declare module '*.svg' {
  const value: any;
  export = value;
}

declare module '*.png' {
  const value: any;
  export = value;
}

