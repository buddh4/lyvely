import { Exclude, Expose } from 'class-transformer';
import { IsString, Length, IsNotEmpty } from 'class-validator';
import { MESSAGE_MAX_LENGTH } from '../messages.constants';
import { CreateContentModel } from '@/content';
import { Trim, Model } from '@lyvely/common';
import type { PartialPropertiesOf } from '@lyvely/common';

@Exclude()
export class CreateMessageModel extends CreateContentModel<CreateMessageModel> {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @Trim()
  @Length(1, MESSAGE_MAX_LENGTH)
  text: string;

  constructor(data?: PartialPropertiesOf<CreateMessageModel>) {
    // When initialized in the stream we get a title automatically
    // TODO: Find a better way of handling content entries which do not support a title field
    if ((<any>data)?.title && !data?.text) {
      data!.text = (<any>data).title;
      delete (<any>data).title;
    }
    super();
    Model.init(this, data);
  }
}
