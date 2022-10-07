import repository from "@/repository";
import { AppConfig } from "@lyvely/common";

// TODO: change to config endpoint
const resource = "app-config";

export default {
  async loadConfig() {
    return repository.get<AppConfig>(`${resource}`);
  },
};