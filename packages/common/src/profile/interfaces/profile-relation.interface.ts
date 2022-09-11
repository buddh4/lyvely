import { PropertiesOf } from "../../util";
import { ProfileModel } from "../models";

export interface IProfileRelationUserInfo {
  displayName: string;
  imageHash?: string;
  email?: string;
  description?: string;
}

export interface IProfileRelation {
  oid: TObjectId;
  uid: TObjectId;
  pid: TObjectId;
  userInfo: IProfileRelationUserInfo;
  type: string;
  role?: string;
}

export interface IMembership extends IProfileRelation {
  role: string;
}

export interface IProfileMembership {
  profile: PropertiesOf<ProfileModel>;
  membership: IMembership;
}
