import { Expose, Exclude } from 'class-transformer';
import { IsNotEmpty, IsHexColor, IsString, IsOptional, IsBoolean } from 'class-validator';
import randomColor from 'randomcolor';
import { BaseModel, type PropertiesOf } from '@lyvely/common';

@Exclude()
export class CreateTagModel {
  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;

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

  constructor(obj?: PropertiesOf<CreateTagModel>) {
    BaseModel.init(this, obj);
    this.includeOnFilter = this.includeOnFilter ?? false;
    this.color = this.color || randomColor({ luminosity: 'dark' });
  }
}
