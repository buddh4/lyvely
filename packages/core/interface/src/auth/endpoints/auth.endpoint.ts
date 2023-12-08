import { Endpoint } from '@/endpoints';
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
export const API_AUTH = 'auth';

export const AuthEndpoints = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  REFRESH: 'refresh',
  USER: 'user',
};
