import { Exclude, Expose } from 'class-transformer';
import { IsString, Length } from 'class-validator';
import { MESSAGE_MAX_LENGTH } from '../messages.constants';
import { CreateContentModel } from '@/content';

@Exclude()
export class CreateMessage extends CreateContentModel<CreateMessage> {
  @Expose()
  @IsString()
  @Length(1, MESSAGE_MAX_LENGTH)
  text: string;

  constructor(text: string, parentId?: string) {
    super({ text, parentId });
  }
}
