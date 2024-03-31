import { Expose, instanceToPlain, Transform } from 'class-transformer';
import { BaseModel, PropertyType, StrictBaseModelData } from '@lyvely/common';
import { ProfileRelationDetailsModel } from './profile-relation.model';
import { ProfileRelationRole } from '../interfaces';

export class UpdateUserRelationsResponse<TID = string> {
  /** Contains user specific relations of the profile. **/
  @Expose()
  @PropertyType([ProfileRelationDetailsModel])
  @Transform(({ value }) => instanceToPlain(value))
  userRelations: ProfileRelationDetailsModel<TID>[];

  /** Contains the relationship role of the active user to this profile **/
  @Expose()
  role: ProfileRelationRole;

  constructor(data: StrictBaseModelData<UpdateUserRelationsResponse<any>>) {
    BaseModel.init(this, data);
  }
}
