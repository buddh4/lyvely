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
