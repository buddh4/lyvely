import {
  IUserRegistrationService,
  UserRegistrationDto,
  VerifyEmailDto,
  ResendOtpDto,
} from "@lyvely/common";
import registerRepository from "../repositories/user-registration.repository";
import { unwrapEndpointRequest } from "@/modules/core";

export class UserRegistrationService implements IUserRegistrationService {
  async register(model: UserRegistrationDto): Promise<void> {
    return unwrapEndpointRequest(registerRepository.register(model));
  }

  async verifyEmail(verifyEmail: VerifyEmailDto) {
    return unwrapEndpointRequest(registerRepository.verifyEmail(verifyEmail));
  }

  async resendVerifyEmail(dto: ResendOtpDto) {
    return unwrapEndpointRequest(registerRepository.resendVerifyEmail(dto));
  }
}
