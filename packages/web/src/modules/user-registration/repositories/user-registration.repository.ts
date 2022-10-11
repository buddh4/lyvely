import repository from "@/repository";
import {
  UserRegistrationDto,
  ENDPOINT_USER_REGISTRATION,
  ILoginResponse,
} from "@lyvely/common";

const endpoint = ENDPOINT_USER_REGISTRATION;

export default {
  register(data: UserRegistrationDto) {
    return repository.post<ILoginResponse>(`${endpoint}/`, data);
  },
};
