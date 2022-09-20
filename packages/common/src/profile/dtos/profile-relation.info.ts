import { Exclude, Expose } from 'class-transformer';
import { BaseModel, PropertyType } from '../../model';
import { ProfileType } from '../interfaces';

@Exclude()
export class ProfileRelationSummary {
  @Expose()
  type: string;

  @Expose()
  role?: string;
}

@Exclude()
export class ProfileRelationInfo extends BaseModel<ProfileRelationInfo> {

  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  score: number;

  @Expose()
  type: ProfileType;

  @Expose()
  imageHash: string;

  @PropertyType([ProfileRelationSummary])
  relations: ProfileRelationSummary[];
}

@Exclude()
export class ProfileRelationInfos extends BaseModel<ProfileRelationInfos> {
  @Expose()
  @PropertyType([ProfileRelationInfo])
  profiles: ProfileRelationInfo[];
}