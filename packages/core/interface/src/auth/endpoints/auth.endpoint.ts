import { Endpoint } from '@lyvely/common';
import { UserModel } from '@/users';
import { LoginModel } from '../models';

export interface IRefreshTokenResponse {
  token_expiration: number;
}

export interface ILoadUserResponse extends IRefreshTokenResponse {
  user: UserModel;
}

export interface ILoginResponse extends ILoadUserResponse {
  vid: string;
}

export interface IAuthClient {
  login(loginModel: LoginModel): Promise<ILoginResponse>;
  logout(vid?: string): void;
  loadUser(): Promise<ILoadUserResponse>;
  refresh(vid: string): Promise<IRefreshTokenResponse>;
}

export type AuthEndpoint = Endpoint<IAuthClient>;
export const ENDPOINT_AUTH = 'auth';

export const AuthEndpointPaths = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  REFRESH: 'refresh',
  USER: 'user',
};

export const ENDPOINT_AUTH_PATH_USER = 'user';
