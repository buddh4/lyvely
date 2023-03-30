import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from '@/core';
import { IContentDataType } from '@lyvely/common';

@Schema()
export class ContentDataType<T extends IContentDataType = any>
  extends BaseEntity<T>
  implements IContentDataType
{
  @Prop()
  title?: string;

  @Prop()
  text?: string;

  constructor(obj: Partial<ContentDataType>) {
    super();
    this.title = obj.title;
    this.text = obj.text;
  }

  getTitle(): string {
    return this.title;
  }

  getTextContent(): string {
    return this.text;
  }
}

export const ContentDataTypeSchema = SchemaFactory.createForClass(ContentDataType);
