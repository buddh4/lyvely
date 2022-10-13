import {
  IUserRegistrationService,
  UserRegistrationDto,
  ILoginResponse,
} from "@lyvely/common";
import registerRepository from "../repositories/user-registration.repository";
import { errorToServiceException } from "@/util";

export class UserRegistrationService implements IUserRegistrationService {
  async register(model: UserRegistrationDto): Promise<ILoginResponse> {
    return registerRepository
      .register(model)
      .then(({ data }) => data as ILoginResponse)
      .catch((err) => {
        throw errorToServiceException(err);
      });
  }
}
