import App from "@server/App.vue";
import { Module } from "@server/modules/core/modules/interfaces/module.interface";

export default () => {
  return {
    getId: () => 'activity',
    init: (app: App) => {
      console.log('works...');
    }
  }
}

