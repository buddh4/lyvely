import { Expose } from 'class-transformer';
import { MaxLength, IsArray, IsOptional, IsString, IsMongoId } from 'class-validator';
import { BaseModel, type BaseModelData } from '@lyvely/common';

export class CreateContentModel {
  @Expose()
  @IsArray()
  @MaxLength(50, { each: true })
  @IsOptional()
  tagNames?: string[] = [];

  @Expose()
  @IsString()
  @IsOptional()
  @IsMongoId()
  parentId?: string;

  constructor(data: BaseModelData<CreateContentModel>) {
    BaseModel.init(this, data);
  }
}
