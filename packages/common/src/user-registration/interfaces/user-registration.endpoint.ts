import { StrictEndPoint } from '@/utils';
import { UserRegistrationDto } from '../dtos/register.dto';

export interface IUserRegistrationService {
  register(model: UserRegistrationDto);
  validateEmail(email: string): Promise<boolean>;
}

export type UserRegistrationEndpoint = StrictEndPoint<IUserRegistrationService>;
export const ENDPOINT_USER_REGISTRATION = 'user-registration';
