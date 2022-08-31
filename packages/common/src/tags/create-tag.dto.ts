import { Expose, Exclude } from 'class-transformer';
import { IsNotEmpty, IsHexColor, IsString, IsOptional, IsBoolean } from 'class-validator';
import randomColor from "randomcolor";
import { BaseDto } from "../model";

@Exclude()
export class CreateTagDto extends BaseDto<CreateTagDto>{
  @Expose()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @Expose()
  @IsHexColor()
  @IsNotEmpty()
  color?: string;

  @Expose()
  @IsString()
  @IsOptional()
  description?: string;

  @Expose()
  @IsBoolean()
  @IsOptional()
  includeOnFilter?: boolean;

  constructor(obj?: Partial<CreateTagDto>) {
    super(obj);
    this.includeOnFilter = this.includeOnFilter ?? false;
    this.color = this.color || randomColor({ luminosity: 'dark' });
  }
}
