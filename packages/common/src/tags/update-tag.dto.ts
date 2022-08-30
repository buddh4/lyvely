import { BaseDto } from '../model';
import { Expose, Exclude } from 'class-transformer';
import { IsNotEmpty, IsHexColor, IsString, IsOptional, IsBoolean } from 'class-validator';

@Exclude()
export class UpdateTagDto extends BaseDto<UpdateTagDto> {
  @Expose()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @Expose()
  @IsOptional()
  @IsHexColor()
  @IsNotEmpty()
  color?: string;

  @Expose()
  @IsOptional()
  @IsString()
  description?: string;

  @Expose()
  @IsOptional()
  @IsBoolean()
  @IsOptional()
  includeOnFilter?: boolean;
}
