import { Exclude, Expose } from 'class-transformer';
import { IsString, Length } from 'class-validator';
import { MESSAGE_MAX_LENGTH } from '../message.constants';
import { CreateContentModel } from '@/content';

@Exclude()
export class CreateMessage extends CreateContentModel<CreateMessage> {
  @Expose()
  @IsString()
  @Length(1, MESSAGE_MAX_LENGTH)
  text: string;

  constructor(text: string) {
    super({ text });
  }
}
