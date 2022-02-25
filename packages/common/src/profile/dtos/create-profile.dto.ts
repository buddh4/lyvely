import { Exclude, Expose } from 'class-transformer';
import { BaseDto } from '../../model';
import { IsEnum, IsString } from 'class-validator';
import { ProfileType } from '../interfaces';

@Exclude()
export class CreateProfileDto extends BaseDto<CreateProfileDto> {
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsEnum(ProfileType)
  type: ProfileType;
}