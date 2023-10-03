import { IPolicy } from '@lyvely/policies';
import { IUserContext } from '@lyvely/users';

export abstract class CreateUserProfilePolicy implements IPolicy<IUserContext> {
  abstract verify(context: IUserContext): Promise<boolean>;
}

export const PROVIDER_KEY = CreateUserProfilePolicy.name;
