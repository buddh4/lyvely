import { LoginModel } from '../models';
import { ENDPOINT_AUTH } from '../endpoints';
import { Headers } from '@lyvely/common';
import { useApi } from '@/repository';
import { AuthEndpointPaths, IAuthClient } from '@/auth';

const api = useApi<IAuthClient>(ENDPOINT_AUTH);

export default {
  async loadUser() {
    return api.get<'loadUser'>(AuthEndpointPaths.USER);
  },
  async login(loginModel: LoginModel) {
    return api.post<'login'>(AuthEndpointPaths.LOGIN, loginModel);
  },
  async refresh(visitorId?: string | null) {
    return api.post<'refresh'>(
      AuthEndpointPaths.REFRESH,
      {},
      {
        skipAuthRefresh: true,
        headers: { [Headers.X_VISITOR_ID]: visitorId || '' },
      },
    );
  },
  async logout(visitorId?: string | null) {
    return api.post<'logout'>(
      AuthEndpointPaths.LOGOUT,
      {},
      {
        skipAuthRefresh: true,
        headers: { [Headers.X_VISITOR_ID]: visitorId || '' },
      },
    );
  },
};
