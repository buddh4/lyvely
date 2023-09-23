import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PropertiesOf } from '@lyvely/common';
import { AvatarModel } from '@lyvely/users-interface';

@Schema({ _id: false })
export class Avatar implements PropertiesOf<AvatarModel> {
  @Prop({ required: true })
  guid: string;

  @Prop({ required: true })
  timestamp: number;

  constructor(guid: string) {
    this.guid = guid;
    this.timestamp = Date.now();
  }
}

export const AvatarSchema = SchemaFactory.createForClass(Avatar);
