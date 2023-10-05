import repository from '@/repository';
import {
  ILoadUserResponse,
  ILoginResponse,
  IRefreshTokenResponse,
  ENDPOINT_AUTH,
  LoginModel,
  IAuthService,
} from '@lyvely/auth-interface';
import { Headers, EndpointResult } from '@lyvely/common';

const resource = 'test';

export default {
  async loadUser() {
    return repository.get<ILoadUserResponse>(`${resource}/user`, {
      withCredentials: true,
    });
  },
  async loadConfig() {
    return repository.get<any>(`${resource}/config`);
  },
  async login(loginModel: LoginModel) {
    return repository.post<EndpointResult<IAuthService['login']>>(`${resource}/login`, loginModel);
  },
  async refresh(visitorId?: string | null) {
    return repository.post<IRefreshTokenResponse>(
      `${resource}/refresh`,
      {},
      {
        skipAuthRefresh: true,
        headers: { [Headers.X_VISITOR_ID]: visitorId || '' },
      },
    );
  },
  async logout(visitorId?: string | null) {
    return repository.post<ILoginResponse>(
      `${resource}/logout`,
      {},
      {
        skipAuthRefresh: true,
        headers: { [Headers.X_VISITOR_ID]: visitorId || '' },
      },
    );
  },
};
