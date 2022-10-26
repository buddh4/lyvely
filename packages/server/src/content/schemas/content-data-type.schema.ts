import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from '@/core';
import { IContentDataType } from '@lyvely/common';

@Schema()
export class ContentDataType<T extends IContentDataType = any> extends BaseEntity<T> implements IContentDataType {
  @Prop()
  title?: string;

  @Prop()
  textContent?: string;

  getTitle(): string {
    return this.title;
  }

  getTextContent(): string {
    return this.textContent;
  }
}

export const ContentDataTypeSchema = SchemaFactory.createForClass(ContentDataType);
