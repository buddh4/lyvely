import { IUserContext, IUserPolicy } from '@/users';

export abstract class UserCanInvitePolicy implements IUserPolicy {
  abstract verify(context: IUserContext): Promise<boolean>;
}
