import { ContentDataType, ContentType } from '@/content';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NestedSchema } from '@/core';
import { SystemMessageModel } from '@lyvely/common';

@NestedSchema()
export class SystemMessageContent extends ContentDataType {
  @Prop({ type: [String] })
  params?: Array<string>;
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
