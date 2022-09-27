import repository from "@server/repository";
import { IUser, Headers } from '@lyvely/common';

const resource = "auth";

interface LoadUserResponse {
  user: IUser,
  token_expiration: number
}

interface LoginResponse extends LoadUserResponse {
  user: IUser,
  vid: string,
  token_expiration: number
}

interface TokenRefreshResponse {
  token_expiration: number,
}

export default {
  loadUser() {
    return repository.get<LoadUserResponse>(`${resource}/user`, { withCredentials:true });
  },
  loadConfig() {
    return repository.get<any>(`${resource}/config`);
  },
  login(username: string, password: string) {
    return repository.post<LoginResponse>(`${resource}/login`, {
      username: username,
      password: password
    });
  },
  refresh(visitorId?: string|null) {
    return repository.post<TokenRefreshResponse>(`/auth/refresh`,{}, {
      skipAuthRefresh: true,
      headers: { [Headers.X_VISITOR_ID]: visitorId || '' }
    });
  },
  logout(visitorId?: string|null) {
    return repository.post<LoginResponse>(`${resource}/logout`, {}, {
      skipAuthRefresh: true,
      headers: { [Headers.X_VISITOR_ID]: visitorId || '' }
    });
  }
};
