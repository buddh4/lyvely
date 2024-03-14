import { ICreateProfileScore, ProfileScore } from '@/profiles';
import { ModelDefinition, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Content } from './content.schema';
import { type PartialPropertiesOf } from '@lyvely/common';
import { IntegrityException } from '@lyvely/interface';
import { ObjectIdProp, TObjectId } from '@/core';

export interface ICreateContentScore extends ICreateProfileScore {
  content: Content;
}

@Schema({ timestamps: true, discriminatorKey: 'type' })
export class ContentScore extends ProfileScore {
  @ObjectIdProp()
  cid: TObjectId;

  constructor(options: ICreateContentScore, data: PartialPropertiesOf<ContentScore> = {}) {
    if (!options.content.pid.equals(options.profile._id)) {
      throw new IntegrityException('Tried to create a content score on an unrelated profile');
    }

    super(options, data);
    this.cid ??= options.content._id;
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
