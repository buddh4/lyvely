export interface IProfileRelationUserInfo {
  displayName: string;
  guid?: string;
  email?: string;
  description?: string;
}

export interface IProfileRelation {
  oid: any;
  uid: any;
  pid: any;
  userInfo: IProfileRelationUserInfo;
  type: string;
  role?: string;
}

export interface IMembership extends IProfileRelation {
  role: string;
}
