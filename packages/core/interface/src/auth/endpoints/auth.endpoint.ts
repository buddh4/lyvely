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

export interface IAuthService {
  login(loginModel: LoginModel): Promise<ILoginResponse>;
  logout(vid?: string): void;
  loadUser(): Promise<ILoadUserResponse>;
  refresh(vid: string): Promise<IRefreshTokenResponse>;
}

export type AuthEndpoint = Endpoint<IAuthService>;
export const ENDPOINT_AUTH = 'auth';
