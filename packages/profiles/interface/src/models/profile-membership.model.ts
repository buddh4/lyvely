import { Exclude, Expose } from 'class-transformer';
import { IMembership } from '../interfaces';
import { ProfileRelationModel } from './profile-relation.model';

@Exclude()
export class MembershipModel extends ProfileRelationModel<MembershipModel> implements IMembership {
  @Expose()
  readonly role: string;
}
