import { MaxLength, IsOptional, IsString, IsNotEmpty, Length } from 'class-validator';
import { Trim } from '@lyvely/common';
import { MAX_CONTENT_TITLE_LENGTH } from '../content.constants';
import { CreateBaseContentModel } from './create-base-content.model';

export class CreateContentModel extends CreateBaseContentModel {
  @IsString()
  @IsNotEmpty()
  @Trim()
  @MaxLength(MAX_CONTENT_TITLE_LENGTH)
  title: string;

  @IsString()
  @IsOptional()
  @Trim()
  @Length(0, 2500)
  text?: string;
}
