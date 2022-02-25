import { IProfileRelation } from './profile-relation.interface';
import { IProfile } from './profile.interface';

export interface IMembership extends IProfileRelation {
  role: string;
}

export interface IProfileMembership {
  membership: IMembership;
  profile: IProfile;
}