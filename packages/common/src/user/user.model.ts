import { DocumentDto } from "../model";
import { Exclude, Expose } from "class-transformer";
import { IUser } from './user.interface';

@Exclude()
export class UserDto extends DocumentDto<UserDto> implements IUser {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  locale: string;
}

export enum UserAssignmentStrategy {
  Shared,
  PerUser
}
