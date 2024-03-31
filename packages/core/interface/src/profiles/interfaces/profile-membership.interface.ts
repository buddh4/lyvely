import { IProfileRelation } from './profile-relation.interface';

export interface IMembership<TID = string> extends IProfileRelation<TID> {
  role: string;
}
