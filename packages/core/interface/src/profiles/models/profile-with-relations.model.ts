import { Exclude, Expose } from 'class-transformer';
import { MembershipModel } from './profile-membership.model';
import { ProfileRelationDetailsModel, ProfileRelationModel } from './profile-relation.model';
import { BaseUserProfileRelationType, ProfileModel } from './profile.model';
import { PropertyType, TransformTo } from '@lyvely/common';

@Exclude()
export class ProfileWithRelationsModel<TID = string> extends ProfileModel<TID> {
  /**
   * Contains user specific relations of the profile
   */
  @Expose()
  @PropertyType([ProfileRelationDetailsModel])
  @TransformTo(ProfileRelationDetailsModel)
  userRelations: ProfileRelationDetailsModel[];

  /**
   * Contains all relations of the profile
   */
  @Expose()
  @PropertyType([ProfileRelationModel])
  @TransformTo(ProfileRelationModel)
  profileRelations: ProfileRelationModel[];

  constructor(obj?: Partial<ProfileWithRelationsModel<any>>) {
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
