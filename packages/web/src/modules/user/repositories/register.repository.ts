import repository from "@/repository";
import { RegisterDto } from '@lyvely/common';

const resource = "register";

export default {
  register(data: RegisterDto) {
    return repository.post(`${resource}/`, data);
  }
};
