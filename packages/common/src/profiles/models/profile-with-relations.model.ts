import { Exclude, Expose } from 'class-transformer';
import { MembershipModel } from './profile-membership.model';
import { ProfileRelationModel } from './profile-relation.model';
import { BaseUserProfileRelationType, ProfileModel } from './profile.model';
import { PropertyType } from '@/models';

@Exclude()
export class ProfileWithRelationsModel extends ProfileModel {
  @Expose()
  @PropertyType([ProfileRelationModel])
  readonly relations: ProfileRelationModel[];

  constructor(obj?: Partial<ProfileWithRelationsModel>) {
    super(obj);
  }

  getMembership(): MembershipModel | null {
    return <MembershipModel | null>(
      this.relations.find((relation) => relation.type === BaseUserProfileRelationType.Membership)
    );
  }
}
