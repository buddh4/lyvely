import { LoginModel } from '../models';
import { API_AUTH, AuthEndpoints, IAuthClient } from './auth.endpoint';
import { Headers } from '@/common';
import { useApi } from '@/repository';
// TODO: https://github.com/microsoft/TypeScript/issues/47663
import type {} from 'axios';

const api = useApi<IAuthClient>(API_AUTH);

export default {
  async loadUser() {
    return api.get<'loadUser'>(AuthEndpoints.USER);
  },
  async login(loginModel: LoginModel) {
    return api.post<'login'>(AuthEndpoints.LOGIN, loginModel);
  },
  async refresh(visitorId?: string | null) {
    return api.post<'refresh'>(
      AuthEndpoints.REFRESH,
      {},
      {
        skipAuthRefresh: true,
        headers: { [Headers.X_VISITOR_ID]: visitorId || '' },
      },
    );
  },
  async logout(visitorId?: string | null) {
    return api.post<'logout'>(
      AuthEndpoints.LOGOUT,
      {},
      {
        skipAuthRefresh: true,
        headers: { [Headers.X_VISITOR_ID]: visitorId || '' },
      },
    );
  },
};
