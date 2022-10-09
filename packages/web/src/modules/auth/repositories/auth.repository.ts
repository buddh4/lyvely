import repository from "@/repository";
import {
  Headers,
  ILoadUserResponse,
  ILoginResponse,
  IRefreshTokenResponse,
  ENDPOINT_AUTH,
  LoginModel,
} from "@lyvely/common";

const resource = ENDPOINT_AUTH;

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
    return repository.post<ILoginResponse>(`${resource}/login`, loginModel);
  },
  async refresh(visitorId?: string | null) {
    return repository.post<IRefreshTokenResponse>(
      `${resource}/refresh`,
      {},
      {
        skipAuthRefresh: true,
        headers: { [Headers.X_VISITOR_ID]: visitorId || "" },
      }
    );
  },
  async logout(visitorId?: string | null) {
    return repository.post<ILoginResponse>(
      `${resource}/logout`,
      {},
      {
        skipAuthRefresh: true,
        headers: { [Headers.X_VISITOR_ID]: visitorId || "" },
      }
    );
  },
};
