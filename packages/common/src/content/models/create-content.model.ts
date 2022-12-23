import { Expose } from 'class-transformer';
import { MaxLength, IsArray, IsOptional } from 'class-validator';
import { BaseModel } from '@/models';

export class CreateContentModel<T extends CreateContentModel = any> extends BaseModel<T> {
  @Expose()
  @IsArray()
  @MaxLength(50, { each: true })
  @IsOptional()
  tagNames?: string[];
}
