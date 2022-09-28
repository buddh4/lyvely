import { IModule } from "@/modules/core/modules/interfaces/module.interface";

export default () => {
  return {
    getId: () => "activity",
    init: () => {
      console.log("works...");
    },
  } as IModule;
};
