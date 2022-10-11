import { StrictEndPoint } from '@/endpoints';
import { UserRegistrationDto } from '../dtos/user-registration.dto';
import { ILoginResponse } from '@/auth';

export interface IUserRegistrationService {
  register(model: UserRegistrationDto): Promise<ILoginResponse>;
}

export type UserRegistrationEndpoint = StrictEndPoint<IUserRegistrationService>;
export const ENDPOINT_USER_REGISTRATION = 'user-registration';
