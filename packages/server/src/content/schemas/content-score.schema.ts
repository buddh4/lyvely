import { ICreateProfileScore, IProfileScoreAction, ProfileScore } from '../../profiles';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Content } from './content.schema';
import { DeepPartial, IntegrityException } from '@lyvely/common';

interface ICreateContentScore extends ICreateProfileScore {
  content: Content;
}

interface IContentScore extends IProfileScoreAction {
  cid: TObjectId;
}

@Schema({ timestamps: true, discriminatorKey: 'type' })
export class ContentScore<T extends IContentScore = IContentScore> extends ProfileScore<T> {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  cid: TObjectId;

  constructor(options: ICreateContentScore, data: DeepPartial<T> = {}) {
    data.cid = options.content._id;

    if (!options.content.pid.equals(options.profile._id)) {
      throw new IntegrityException('Tried to create a content score on an unrelated profile');
    }

    super(options, data);
  }
}

export const ContentScoreSchema = SchemaFactory.createForClass(ContentScore);
export type ContentActionDocument = ContentScore & mongoose.Document;
