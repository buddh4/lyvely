import { ContentDataType, ContentType } from '@/content';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MixedProp, NestedSchema } from '@/core';
import { SystemMessageModel, SystemMessageContentModel } from '@lyvely/core-interface';
import { Types } from 'mongoose';

@NestedSchema()
export class SystemMessageContent extends ContentDataType implements SystemMessageContentModel {
  @MixedProp()
  params?: Record<string, string>;
}

const SystemMessageContentSchema = SchemaFactory.createForClass(SystemMessageContent);

@Schema()
export class SystemMessage
  extends ContentType<SystemMessage>
  implements SystemMessageModel<Types.ObjectId>
{
  @Prop({ type: SystemMessageContentSchema })
  content: SystemMessageContent;

  toModel(): SystemMessageModel {
    return new SystemMessageModel(this);
  }
}

export const SystemMessageSchema = SchemaFactory.createForClass(SystemMessage);
