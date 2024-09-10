import { MaxLength, IsOptional, IsString, IsNotEmpty, Length } from 'class-validator';
import { Trim } from '@lyvely/common';
import { MAX_CONTENT_TITLE_LENGTH } from '../content.constants';
import { CreateBaseContentModel } from './create-base-content.model';
import { Expose } from 'class-transformer';

export class CreateContentModel extends CreateBaseContentModel {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @Trim()
  @MaxLength(MAX_CONTENT_TITLE_LENGTH)
  title: string;

  @Expose()
  @IsString()
  @IsOptional()
  @Trim()
  @Length(0, 2500)
  text?: string;
}
