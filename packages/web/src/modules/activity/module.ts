import App from "@/App.vue";
import { Module } from "@/modules/core/modules/interfaces/module.interface";

export default () => {
  return {
    getId: () => 'activity',
    init: (app: App) => {
      console.log('works...');
    }
  }
}

