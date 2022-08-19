import { DocumentDto } from '../model';
import { Expose } from 'class-transformer';
import { ITag } from './category.interface';

export class CategoryDto extends DocumentDto<CategoryDto> implements ITag {
  @Expose()
  name: string;
}