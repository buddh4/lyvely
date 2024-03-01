import { Expose } from 'class-transformer';
import { MaxLength, IsArray, IsOptional, IsString, IsMongoId } from 'class-validator';
import { Model, PartialPropertiesOf } from '@lyvely/common';

export class CreateContentModel<T extends CreateContentModel = any> {
  @Expose()
  @IsArray()
  @MaxLength(50, { each: true })
  @IsOptional()
  tagNames?: string[];

  @Expose()
  @IsString()
  @IsOptional()
  @IsMongoId()
  parentId?: string;

  constructor(data?: PartialPropertiesOf<T>) {
    Model.init<CreateContentModel<T>>(this, data);
  }
}
