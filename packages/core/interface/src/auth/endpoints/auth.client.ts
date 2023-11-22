import authRepository from './auth.repository';
import { unwrapResponse } from '@/endpoints';
import { useSingleton } from '@lyvely/common';
import { IAuthClient } from './auth.endpoint';
import { LoginModel } from '../models';
import { UserModel } from '@/users';

export class AuthClient implements IAuthClient {
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
    return unwrapResponse(authRepository.loadUser()).then((loginResponse) => {
      loginResponse.user = new UserModel(loginResponse.user);
      return loginResponse;
    });
  }

  async refresh(vid: string) {
    return unwrapResponse(authRepository.refresh(vid));
  }
}

export const useAuthClient = useSingleton(() => new AuthClient());
