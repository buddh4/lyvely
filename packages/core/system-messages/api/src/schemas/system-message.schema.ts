import { ContentDataType, ContentType } from '@lyvely/content';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MixedProp, NestedSchema } from '@lyvely/core';
import { SystemMessageModel } from '@lyvely/system-messages-interface';

@NestedSchema()
export class SystemMessageContent extends ContentDataType {
  @MixedProp()
  params?: Record<string, string>;
}

const SystemMessageContentSchema = SchemaFactory.createForClass(SystemMessageContent);

@Schema()
export class SystemMessage extends ContentType<SystemMessage> {
  @Prop({ type: SystemMessageContentSchema })
  content: SystemMessageContent;

  toModel(): SystemMessageModel {
    return new SystemMessageModel(this);
  }
}

export const SystemMessageSchema = SchemaFactory.createForClass(SystemMessage);
