import { Exclude, Expose } from 'class-transformer';
import { MembershipModel } from './profile-membership.model';
import { ProfileRelationDetailsModel, ProfileRelationModel } from './profile-relation.model';
import { ProfileModel } from './profile.model';
import { BaseUserProfileRelationType } from '../interfaces';
import { IEditableModel, PropertyType, TransformTo } from '@lyvely/common';
import { UpdateProfileModel } from './update-profile.model';

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
