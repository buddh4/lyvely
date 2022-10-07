import { IAuthService, UserModel, LoginModel } from "@lyvely/common";

import authRepository from "@/modules/users/repositories/auth.repository";

export class AuthService implements IAuthService {
  async login(loginModel: LoginModel) {
    const { data: loginResponse } = await authRepository.login(loginModel);
    loginResponse.user = new UserModel(loginResponse.user);
    return loginResponse;
  }

  async logout(vid?: string) {
    return authRepository.logout(vid);
  }

  async loadUser() {
    const { data: user } = await authRepository.loadUser();
    return user;
  }

  async refresh(vid: string) {
    const { data: result } = await authRepository.refresh(vid);
    return result;
  }
}
