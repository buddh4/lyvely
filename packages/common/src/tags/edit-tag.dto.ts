import { BaseDto } from '../model';
import { Expose, Exclude } from 'class-transformer';
import { IsNotEmpty, IsHexColor, IsString, IsOptional } from 'class-validator';

@Exclude()
export class EditTagDto extends BaseDto<EditTagDto> {
  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsHexColor()
  @IsNotEmpty()
  color: string;

  @Expose()
  @IsString()
  @IsOptional()
  description?: string;
}
