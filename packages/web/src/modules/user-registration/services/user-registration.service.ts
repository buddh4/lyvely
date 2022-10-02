import { IUserRegistrationService } from "@lyvely/common";
import { UserRegistrationDto } from "@lyvely/common/src";
import registerRepository from "../repositories/user-registration.repository";

export class UserRegistrationService implements IUserRegistrationService {
  async register(model: UserRegistrationDto) {
    return registerRepository.register(model);
  }
}
