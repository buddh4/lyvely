import { BaseModel, DocumentModel, PropertyType } from '@/models';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';

@Exclude()
export class UserEmailModel extends BaseModel<UserEmailModel> {
  @Expose()
  email: string;

  @Expose()
  verified: boolean;
}

@Exclude()
export class UserModel extends DocumentModel<UserModel> {
  @Expose()
  id: string;

  @Expose()
  status: UserStatus;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  @PropertyType(Date)
  createdAt: Date;

  @Expose()
  imageHash: string;

  @Expose()
  locale: string;

  @Expose()
  @IsArray()
  @Type(() => UserEmailModel)
  @PropertyType([UserEmailModel])
  emails: UserEmailModel[];

  findEmail(email: string) {
    return this.emails.find((userEmail) => userEmail.email.toLowerCase() === email);
  }
}

export enum UserStatus {
  Disabled, // Manually disabled by system or admin
  Active, // Active state, after successful registration
  EmailVerification, // Email verification required
  Locked, // User is temporarily locked
}
