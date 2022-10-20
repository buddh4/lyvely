import { IAuthService, UserModel, LoginModel } from "@lyvely/common";

import authRepository from "@/modules/auth/repositories/auth.repository";

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
    const { data: userResponse } = await authRepository.loadUser();
    userResponse.user = new UserModel(userResponse.user);
    return userResponse;
  }

  async refresh(vid: string) {
    const { data: result } = await authRepository.refresh(vid);
    return result;
  }
}
