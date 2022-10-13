import { StrictEndPoint } from '@/endpoints';
import { UserRegistrationDto } from '../dtos/user-registration.dto';

export interface IUserRegistrationService {
  /**
   * @throws FieldValidationException
   * @param model
   */
  register(model: UserRegistrationDto);
}

export type UserRegistrationEndpoint = StrictEndPoint<IUserRegistrationService>;
export const ENDPOINT_USER_REGISTRATION = 'user-registration';
