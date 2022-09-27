import { App } from "vue";
import { getI18n } from "@server/i18n";

export interface Module {
  getId: () => string,
  init?: (app: App) => void
}
