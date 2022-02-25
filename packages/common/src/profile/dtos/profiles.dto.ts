import { Exclude, Expose } from 'class-transformer';
import { BaseDto } from '../../model';
import { IProfile } from '../interfaces';

@Exclude()
export class ProfilesDto extends BaseDto<ProfilesDto> {
  @Expose()
  profiles: IProfile[];
}