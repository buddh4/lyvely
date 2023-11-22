import {
  ILoadUserResponse,
  ILoginResponse,
  IRefreshTokenResponse,
  LoginModel,
  IAuthService,
  ENDPOINT_AUTH,
  useApiRepository,
} from '@lyvely/core-interface';
import { Headers, EndpointResult } from '@lyvely/common';

const resource = ENDPOINT_AUTH;

export default {
  async loadUser() {
    return useApiRepository().get<ILoadUserResponse>(`${resource}/user`, {
      withCredentials: true,
    });
  },
  async loadConfig() {
    return useApiRepository().get<any>(`${resource}/config`);
  },
  async login(loginModel: LoginModel) {
    return useApiRepository().post<EndpointResult<IAuthService['login']>>(
      `${resource}/login`,
      loginModel,
    );
  },
  async refresh(visitorId?: string | null) {
    return useApiRepository().post<IRefreshTokenResponse>(
      `${resource}/refresh`,
      {},
      {
        skipAuthRefresh: true,
        headers: { [Headers.X_VISITOR_ID]: visitorId || '' },
      },
    );
  },
  async logout(visitorId?: string | null) {
    return useApiRepository().post<ILoginResponse>(
      `${resource}/logout`,
      {},
      {
        skipAuthRefresh: true,
        headers: { [Headers.X_VISITOR_ID]: visitorId || '' },
      },
    );
  },
};
