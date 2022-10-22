import repository from "@/repository";

const resource = "captcha";

export default {
  async createChallenge(purpose: string) {
    return repository.get(`${resource}`, {
      data: { purpose },
    });
  },
};
