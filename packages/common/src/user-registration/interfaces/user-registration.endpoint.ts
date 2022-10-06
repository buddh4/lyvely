import { StrictEndPoint } from '@/utils';
import { UserRegistrationDto } from '../dtos/user-registration.dto';

export interface IUserRegistrationService {
  register(model: UserRegistrationDto);
}

export type UserRegistrationEndpoint = StrictEndPoint<IUserRegistrationService>;
export const ENDPOINT_USER_REGISTRATION = 'user-registration';
