import { IUserContext, IUserPolicy } from '@lyvely/users';

export abstract class UserCanInvitePolicy implements IUserPolicy {
  abstract verify(context: IUserContext): Promise<boolean>;
}
