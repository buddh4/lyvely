import { Exclude, Expose, instanceToPlain, Transform } from 'class-transformer';
import {
  isMembershipRelation,
  MembershipModel,
  ProfileRelationDetailsModel,
  ProfileRelationModel,
  ProfileRelationRole,
} from '@/profiles/relations';
import { ProfileModel } from './profile.model';
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
  @Transform(({ value }) => instanceToPlain(value))
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
  @Transform(({ value }) => instanceToPlain(value))
  userOrganizationRelations: ProfileRelationDetailsModel<TID>[];

  /**
   * Contains all relations of the profile
   */
  @Expose()
  @PropertyType([ProfileRelationModel])
  @Transform(({ value }) => instanceToPlain(value))
  profileRelations: ProfileRelationModel<TID>[];

  constructor(obj?: Partial<ProfileWithRelationsModel<TID>>) {
    super(obj as Partial<ProfileModel<TID>>);
  }

  getMembership(): MembershipModel | null {
    const result = this.userRelations.find((relation) => isMembershipRelation(relation));
    if (!result) return null;
    return isMembershipRelation(result) ? result : null;
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
