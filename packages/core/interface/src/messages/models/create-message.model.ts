import { Exclude, Expose } from 'class-transformer';
import { IsString, Length, IsNotEmpty } from 'class-validator';
import { MESSAGE_MAX_LENGTH } from '../messages.constants';
import { CreateContentModel } from '@/content';
import { BaseModel, type BaseModelData, Trim } from '@lyvely/common';
import { isPlainObject } from '@lyvely/common';

@Exclude()
export class CreateMessageModel extends CreateContentModel {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @Trim()
  @Length(1, MESSAGE_MAX_LENGTH)
  text: string;

  constructor(data?: BaseModelData<CreateMessageModel>) {
    // When initialized in the stream we get a title automatically
    // TODO: Find a better way of handling content entries which do not support a title field
    if (isPlainObject(data) && (<any>data)?.title && !data?.text) {
      data!.text = (<any>data).title;
      delete (<any>data).title;
    }
    super(false);
    BaseModel.init(this, data);
  }
}
