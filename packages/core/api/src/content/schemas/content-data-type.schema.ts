import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { NestedSchema } from '@/core';
import { IContentDataType, IRenderable, RenderableType } from '@lyvely/interface';
import { BaseModel, type BaseModelData } from '@lyvely/common';

@NestedSchema()
export class ContentDataType implements IContentDataType, IRenderable {
  @Prop()
  title?: string;

  @Prop()
  text?: string;

  @Prop()
  renderType: string = RenderableType.markdown;

  getTitle(): string {
    return this.title || '';
  }

  getTextContent(): string {
    return this.text || '';
  }

  constructor(data: BaseModelData<ContentDataType>) {
    BaseModel.init(this, data);
  }
}

export const ContentDataTypeSchema = SchemaFactory.createForClass(ContentDataType);
