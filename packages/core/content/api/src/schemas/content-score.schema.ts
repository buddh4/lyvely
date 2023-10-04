import { ICreateProfileScore, IProfileScoreAction, ProfileScore } from '@lyvely/profiles';
import { ModelDefinition, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Content } from './content.schema';
import { DeepPartial, IntegrityException } from '@lyvely/common';
import { ObjectIdProp } from '@lyvely/core';

interface ICreateContentScore extends ICreateProfileScore {
  content: Content;
}

interface IContentScore extends IProfileScoreAction {
  cid: mongoose.Types.ObjectId;
}

@Schema({ timestamps: true, discriminatorKey: 'type' })
export class ContentScore<T extends IContentScore = IContentScore> extends ProfileScore<T> {
  @ObjectIdProp()
  cid: mongoose.Types.ObjectId;

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

export function getContentScoreDefinition(definitions: ModelDefinition[]): ModelDefinition {
  return {
    name: ContentScore.name,
    collection: ProfileScore.collectionName(),
    schema: ContentScoreSchema,
    discriminators: definitions,
  };
}
