import App from "@/App.vue";
import { IModule } from "@/modules/core/modules/interfaces/module.interface";

export default () => {
  return {
    getId: () => "activity",
    init: (app: App) => {
      console.log("works...");
    },
  };
};
