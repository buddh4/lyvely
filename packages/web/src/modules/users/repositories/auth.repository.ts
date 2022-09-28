import repository from "@/repository";
import { IUser, Headers } from "@lyvely/common";

const resource = "auth";

interface ILoadUserResponse {
  user: IUser;
  token_expiration: number;
}

interface ILoginResponse extends ILoadUserResponse {
  user: IUser;
  vid: string;
  token_expiration: number;
}

interface ITokenRefreshResponse {
  token_expiration: number;
}

export default {
  loadUser() {
    return repository.get<ILoadUserResponse>(`${resource}/user`, {
      withCredentials: true,
    });
  },
  loadConfig() {
    return repository.get<any>(`${resource}/config`);
  },
  login(username: string, password: string) {
    return repository.post<ILoginResponse>(`${resource}/login`, {
      username: username,
      password: password,
    });
  },
  refresh(visitorId?: string | null) {
    return repository.post<ITokenRefreshResponse>(
      `/auth/refresh`,
      {},
      {
        skipAuthRefresh: true,
        headers: { [Headers.X_VISITOR_ID]: visitorId || "" },
      }
    );
  },
  logout(visitorId?: string | null) {
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
