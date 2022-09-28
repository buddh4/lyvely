import { Exclude } from 'class-transformer';
import { PartialType } from '@buddh4/mapped-types';
import { CreateTagDto } from './create-tag.dto';

@Exclude()
export class UpdateTagDto extends PartialType(CreateTagDto) {}
