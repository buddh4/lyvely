import { IUserRegistrationService, UserRegistrationDto } from "@lyvely/common";
import registerRepository from "../repositories/user-registration.repository";

export class UserRegistrationService implements IUserRegistrationService {
  async register(model: UserRegistrationDto) {
    return registerRepository.register(model);
  }
}
