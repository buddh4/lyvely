import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { NestedSchema } from '@/core';
import { IContentDataType, IRenderable } from '@lyvely/interface';
import { BaseModel } from '@lyvely/common';

@NestedSchema()
export class ContentDataType<T extends IContentDataType = any>
  extends BaseModel<T>
  implements IContentDataType, IRenderable
{
  @Prop()
  title?: string;

  @Prop()
  text?: string;

  @Prop()
  renderType: string;

  getTitle(): string {
    return this.title || '';
  }

  getTextContent(): string {
    return this.text || '';
  }
}

export const ContentDataTypeSchema = SchemaFactory.createForClass(ContentDataType);
