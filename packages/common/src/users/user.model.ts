import { DocumentModel } from '@/models';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserModel extends DocumentModel<UserModel> {
  @Expose()
  id: string;

  @Expose()
  status: UserStatus;

  @Expose()
  username: string;

  @Expose()
  imageHash: string;

  @Expose()
  locale: string;
}

export enum UserStatus {
  Disabled, // Manually disabled by system or admin
  Active, // Active state, after successful registration
  EmailVerification, // Email verification required
}
