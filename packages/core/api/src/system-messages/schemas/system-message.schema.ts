import { ContentDataType, ContentType, IContentPolicy } from '@/content';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MixedProp, NestedSchema, TObjectId } from '@/core';
import {
  SystemMessageModel,
  SystemMessageContentModel,
  IContentTypeMeta,
  RenderableType,
} from '@lyvely/interface';
import { DeclineAllPolicy } from '@/policies';
import { BaseModel, type StrictBaseModelData, Type } from '@lyvely/common';

@NestedSchema()
export class SystemMessageContent extends ContentDataType implements SystemMessageContentModel {
  @MixedProp()
  params?: Record<string, string>;

  @Prop({ type: String })
  override renderType = RenderableType.translation;

  constructor(data: StrictBaseModelData<Omit<SystemMessageContent, 'renderType'>>) {
    super(false);
    BaseModel.init(this, data);
  }
}

const SystemMessageContentSchema = SchemaFactory.createForClass(SystemMessageContent);

@Schema()
export class SystemMessage
  extends ContentType<undefined, SystemMessageContent>
  implements SystemMessageModel<TObjectId>
{
  @Prop({ type: SystemMessageContentSchema })
  override content: SystemMessageContent;

  toModel(): SystemMessageModel {
    return new SystemMessageModel(this);
  }

  override getWritePolicy(): Type<IContentPolicy> {
    return DeclineAllPolicy;
  }

  override getTypeMeta(): IContentTypeMeta {
    return {
      ...super.getTypeMeta(),
      editable: false,
      taggable: false,
    };
  }
}

export const SystemMessageSchema = SchemaFactory.createForClass(SystemMessage);
