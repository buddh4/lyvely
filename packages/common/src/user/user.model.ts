import { DocumentModel } from "../model";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class UserModel extends DocumentModel<UserModel> {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  imageHash: string;

  @Expose()
  locale: string;
}

export enum UserAssignmentStrategy {
  Shared,
  PerUser
}

export enum UserStatus {
  Disabled, // Manually disabled by system or admin
  Active, // Active state, after successful registration
  Request, // Requested membership, needs manual activation
  EmailVerification, // Email verification required
  Invite// User has been invited, but did not respond
}
