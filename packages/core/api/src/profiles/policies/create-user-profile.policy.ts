import { IPolicy } from '@/policies';
import { IUserContext } from '@/users';

export abstract class CreateUserProfilePolicy implements IPolicy<IUserContext> {
  abstract verify(context: IUserContext): Promise<boolean>;
}

export const PROVIDER_KEY = CreateUserProfilePolicy.name;
