import { ICreateProfileScore, ProfileScore } from '@/profiles';
import { ModelDefinition, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Content } from './content.schema';
import { type PartialPropertiesOf } from '@lyvely/common';
import { IntegrityException } from '@lyvely/interface';
import { ObjectIdProp, TObjectId } from '@/core';

export interface ICreateContentScore extends ICreateProfileScore {
  content: Content;
}

/**
 * Represents a ContentScore object which keeps track of scores related to a content entry.
 * @class
 */
@Schema({ timestamps: true, discriminatorKey: 'type' })
export class ContentScore extends ProfileScore {
  @ObjectIdProp()
  cid: TObjectId;

  constructor(options: ICreateContentScore, data: PartialPropertiesOf<ContentScore> = {}) {
    const opts = { ...options };
    const { content } = opts;
    const { profile } = opts.context;
    if (!content.pid.equals(profile._id)) {
      throw new IntegrityException('Tried to create a content score on an unrelated profile');
    }

    opts.title ??= content.getTitle();
    opts.tagIds ??= content.tagIds;

    super(opts, data);
    this.cid ??= content._id;
  }
}

export const ContentScoreSchema = SchemaFactory.createForClass(ContentScore);

export function getContentScoreDefinition(definitions: ModelDefinition[]): ModelDefinition {
  return {
    name: ContentScore.name,
    collection: ProfileScore.collectionName(),
    schema: ContentScoreSchema,
    discriminators: definitions,
  };
}
