import { IAuthService, LoginModel, UserModel } from '@lyvely/core-interface';

import authRepository from '@/auth/repositories/auth.repository';
import { unwrapResponse } from '@/core';

export class AuthService implements IAuthService {
  async login(loginModel: LoginModel) {
    return unwrapResponse(authRepository.login(loginModel)).then((loginResponse) => {
      loginResponse.user = new UserModel(loginResponse.user);
      return loginResponse;
    });
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