import { ContentDataType, ContentType, IContentPolicy } from '@/content';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MixedProp, NestedSchema, TObjectId } from '@/core';
import { SystemMessageModel, SystemMessageContentModel, IContentTypeMeta } from '@lyvely/interface';
import { DeclineAllPolicy } from '@/policies';
import { Type } from '@lyvely/common';

@NestedSchema()
export class SystemMessageContent extends ContentDataType implements SystemMessageContentModel {
  @MixedProp()
  params?: Record<string, string>;
}

const SystemMessageContentSchema = SchemaFactory.createForClass(SystemMessageContent);

@Schema()
export class SystemMessage
  extends ContentType<SystemMessage>
  implements SystemMessageModel<TObjectId>
{
  @Prop({ type: SystemMessageContentSchema })
  content: SystemMessageContent;

  toModel(): SystemMessageModel {
    return new SystemMessageModel(this);
  }

  getWritePolicy(): Type<IContentPolicy> {
    return DeclineAllPolicy;
  }

  getTypeMeta(): IContentTypeMeta {
    return {
      ...super.getTypeMeta(),
      editable: false,
      taggable: false,
    };
  }
}

export const SystemMessageSchema = SchemaFactory.createForClass(SystemMessage);
