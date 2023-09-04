import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity, NestedSchema } from '@lyvely/core';
import { IContentDataType } from '@lyvely/common';

@NestedSchema()
export class ContentDataType<T extends IContentDataType = any>
  extends BaseEntity<T>
  implements IContentDataType
{
  @Prop()
  title?: string;

  @Prop()
  text?: string;

  getTitle(): string {
    return this.title;
  }

  getTextContent(): string {
    return this.text;
  }
}

export const ContentDataTypeSchema = SchemaFactory.createForClass(ContentDataType);
