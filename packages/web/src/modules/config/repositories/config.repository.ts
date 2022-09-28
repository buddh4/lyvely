import repository from "@/repository";

// TODO: change to config endpoint
const resource = "auth";

export default {
  loadConfig() {
    return repository.get<any>(`${resource}/config`);
  },
};
