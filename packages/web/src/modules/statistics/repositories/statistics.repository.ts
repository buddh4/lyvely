import repository from "@server/repository";

const resource = "statistics";

export default {
  getMonthly() {
    return repository.get(`${resource}/monthly`);
  }
};
