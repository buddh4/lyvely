import { Exclude } from 'class-transformer';
import { PartialType } from '@buddh4/mapped-types';
import { CreateMessageModel } from './create-message.model';

@Exclude()
export class UpdateMessageModel extends PartialType(CreateMessageModel) {}
