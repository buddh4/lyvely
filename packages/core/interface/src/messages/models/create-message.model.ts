import { Exclude, Expose } from 'class-transformer';
import { IsString, Length } from 'class-validator';
import { MESSAGE_MAX_LENGTH } from '../messages.constants';
import { CreateContentModel } from '@/content';
import { PropertiesOf } from '@lyvely/common/src';

@Exclude()
export class CreateMessageModel extends CreateContentModel<CreateMessageModel> {
  @Expose()
  @IsString()
  @Length(1, MESSAGE_MAX_LENGTH)
  text: string;

  constructor(obj?: Partial<PropertiesOf<CreateMessageModel>>) {
    // When initialized in the stream we get a title automatically
    // TODO: Find a better way of handling content entries which do not support a title field
    if ((<any>obj).title && !obj.text) {
      obj.text = (<any>obj).title;
      delete (<any>obj).title;
    }
    super(obj);
  }
}
