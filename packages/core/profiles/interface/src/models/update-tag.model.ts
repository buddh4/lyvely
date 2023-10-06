import { Exclude } from 'class-transformer';
import { PartialType } from '@buddh4/mapped-types';
import { CreateTagModel } from './create-tag.model';

@Exclude()
export class UpdateTagModel extends PartialType(CreateTagModel) {}
