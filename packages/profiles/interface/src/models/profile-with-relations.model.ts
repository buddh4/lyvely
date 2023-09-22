import { Exclude, Expose } from 'class-transformer';
import { MembershipModel } from './profile-membership.model';
import { ProfileRelationDetailsModel, ProfileRelationModel } from './profile-relation.model';
import { BaseUserProfileRelationType, ProfileModel } from './profile.model';
import { PropertyType, TransformTo } from '@lyvely/models';

@Exclude()
export class ProfileWithRelationsModel extends ProfileModel {
  @Expose()
  @PropertyType([ProfileRelationDetailsModel])
  @TransformTo(ProfileRelationDetailsModel)
  userRelations: ProfileRelationDetailsModel[];

  @Expose()
  @PropertyType([ProfileRelationModel])
  @TransformTo(ProfileRelationModel)
  profileRelations: ProfileRelationModel[];

  constructor(obj?: Partial<ProfileWithRelationsModel>) {
    super(obj);
  }

  getMembership(): MembershipModel | null {
    return <MembershipModel | null>(
      this.userRelations.find(
        (relation) => relation.type === BaseUserProfileRelationType.Membership,
      )
    );
  }
}
