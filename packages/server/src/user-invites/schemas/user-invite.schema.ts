import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class UserInvite {
  @Prop()
  createdBy: TObjectId;

  @Prop()
  email: string;

  @Prop()
  token: string;

  @Prop({ type: [Types.ObjectId] })
  pids?: TObjectId[];
}
