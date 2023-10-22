import { Exclude, Expose } from 'class-transformer';
import { MembershipModel } from './profile-membership.model';
import { ProfileRelationDetailsModel, ProfileRelationModel } from './profile-relation.model';
import { ProfileModel } from './profile.model';
import { BaseUserProfileRelationType } from '../interfaces';
import { PropertyType, TransformTo } from '@lyvely/common';

@Exclude()
export class ProfileWithRelationsModel<TID = string> extends ProfileModel<TID> {
  /**
   * Contains user specific relations of the profile
   */
  @Expose()
  @PropertyType([ProfileRelationDetailsModel])
  @TransformTo(ProfileRelationDetailsModel)
  userRelations: ProfileRelationDetailsModel<TID>[];

  /**
   * Contains all relations of the profile
   */
  @Expose()
  @PropertyType([ProfileRelationModel])
  @TransformTo(ProfileRelationModel)
  profileRelations: ProfileRelationModel<TID>[];

  constructor(obj?: Partial<ProfileWithRelationsModel<TID>>) {
    super(obj as Partial<ProfileModel<TID>>);
  }

  getMembership(): MembershipModel | null {
    return <MembershipModel | null>(
      this.userRelations.find(
        (relation) => relation.type === BaseUserProfileRelationType.Membership,
      )
    );
  }
}
