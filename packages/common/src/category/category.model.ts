import { DocumentDto } from '../model';
import { Expose } from 'class-transformer';
import { ICategory } from './category.interface';

export class CategoryDto extends DocumentDto<CategoryDto> implements ICategory {
  @Expose()
  name: string;
}