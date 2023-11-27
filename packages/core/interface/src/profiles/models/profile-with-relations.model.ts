import { Exclude, Expose } from 'class-transformer';
import { MembershipModel } from './profile-membership.model';
import { ProfileRelationDetailsModel, ProfileRelationModel } from './profile-relation.model';
import { ProfileModel } from './profile.model';
import { BaseUserProfileRelationType, ProfileRelationRole } from '../interfaces';
import { IEditableModel } from '@/common';
import { PropertyType } from '@lyvely/common';
import { UpdateProfileModel } from './update-profile.model';

/**
 * This model is used to represent active profiles within the frontend and contains beside basic profile information
 * about all user relations and the relation information of the active user.
 */
@Exclude()
export class ProfileWithRelationsModel<TID = string>
  extends ProfileModel<TID>
  implements IEditableModel<UpdateProfileModel>
{
  /**
   * Contains user specific relations of the profile
   */
  @Expose()
  @PropertyType([ProfileRelationDetailsModel])
  userRelations: ProfileRelationDetailsModel<TID>[];

  /**
   * Contains the relationship role of the active user to this profile
   */
  @Expose()
  role: ProfileRelationRole;

  /**
   * Contains user specific organization relation information
   */
  @Expose()
  @PropertyType([ProfileRelationDetailsModel])
  userOrganizationRelations: ProfileRelationDetailsModel<TID>[];

  /**
   * Contains all relations of the profile
   */
  @Expose()
  @PropertyType([ProfileRelationModel])
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

  toEditModel(): UpdateProfileModel {
    return new UpdateProfileModel({
      name: this.name,
      description: this.description,
      usage: this.usage,
      visibility: this.visibility,
      type: this.type,
    });
  }
}
