export interface IProfileRelationUserInfo {
  displayName: string;
  guid?: string;
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
