import { Exclude, Expose } from 'class-transformer';
import { IMembership, ProfileMembershipRole } from '../interfaces';
import { ProfileRelationModel } from './profile-relation.model';

@Exclude()
export class MembershipModel<TID = string>
  extends ProfileRelationModel<TID, MembershipModel<TID>>
  implements IMembership<TID>
{
  @Expose()
  readonly role: ProfileMembershipRole;
}
