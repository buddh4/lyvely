import { EndPoint } from '@/endpoints';
import { UserModel } from '@/users';

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
  login(email: string, password: string): Promise<ILoginResponse>;
  logout(vid?: string): void;
  loadUser(): Promise<ILoadUserResponse>;
  refresh(vid: string): Promise<IRefreshTokenResponse>;
}

export type AuthEndpoint = EndPoint<IAuthService>;
export const ENDPOINT_AUTH = 'auth';
