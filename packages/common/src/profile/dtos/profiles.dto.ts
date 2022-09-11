import { Exclude, Expose } from 'class-transformer';
import { BaseModel } from '../../model';
import { ProfileModel } from "../models/profile.model";

@Exclude()
export class ProfilesDto extends BaseModel<ProfilesDto> {
  @Expose()
  profiles: ProfileModel[];
}
