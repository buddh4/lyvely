import { Exclude, Expose } from 'class-transformer';
import { BaseModel } from '../../model';
import { IsEnum, IsString, IsOptional } from 'class-validator';
import { ProfileType } from '../interfaces';

@Exclude()
export class CreateProfileDto extends BaseModel<CreateProfileDto> {
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  @IsOptional()
  description: string;

  @Expose()
  @IsEnum(ProfileType)
  type: ProfileType;

  afterInit() {
    this.type = this.type ?? ProfileType.User;
  }
}
