import repository from "@/repository";

const resource = "statistics";

export default {
  getMonthly() {
    return repository.get(`${resource}/monthly`);
  }
};
