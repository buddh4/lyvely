import { Prop, Schema, SchemaFactory, ModelDefinition } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import {
  DeepPartial,
  IContent,
  PropertyType,
  assignRawDataTo,
  ContentModel,
  Type,
} from '@lyvely/common';
import { BaseEntity } from '@/core';
import { ContentLog, ContentLogSchema } from './content-log.schema';
import { ContentMetadata, ContentMetadataSchema } from './content.metadata.schema';
import { CreatedAs, Author } from './content-author.schema';
import { User } from '@/users';
import { Profile, BaseProfileModel } from '@/profiles';
import { Tag } from '@/tags';
import { ContentDataType, ContentDataTypeSchema } from './content-data-type.schema';

export type ContentDocument = Content & mongoose.Document;

export interface IContentEntity extends IContent<TObjectId> {
  _id: TObjectId;
}

@Schema({ discriminatorKey: 'type' })
export class Content<
    TContent extends IContentEntity & BaseEntity<IContentEntity> = any,
    TContentType extends ContentDataType = ContentDataType,
    TConfig extends Object = any,
  >
  extends BaseProfileModel<TContent>
  implements IContent
{
  @Prop({ type: ContentDataTypeSchema })
  @PropertyType(ContentDataType)
  content: TContentType;

  @Prop({ type: ContentMetadataSchema })
  @PropertyType(ContentMetadata)
  meta: ContentMetadata;

  @Prop({ type: [ContentLogSchema], default: [] })
  @PropertyType([ContentLog])
  logs: ContentLog[];

  @Prop({ type: [mongoose.Types.ObjectId], default: [] })
  tagIds: TObjectId[];

  config: any;

  type: string;

  constructor(profile: Profile, createdBy: User, obj: DeepPartial<TContent> = {}) {
    obj.meta = obj.meta || new ContentMetadata();
    obj.meta.createdBy = createdBy._id;
    obj.meta.createdAs = obj.meta.createdAs || new CreatedAs(createdBy);
    obj.pid = profile._id;
    obj.oid = profile.oid;
    super(obj);
  }

  applyContentUpdate(update: Partial<TContentType>) {
    this.content = assignRawDataTo(this.content || ({} as TContentType), update);
  }

  getDefaults() {
    return {
      config: this.getDefaultConfig(),
    };
  }

  getDefaultConfig(): TConfig {
    return undefined;
  }

  static collectionName() {
    return 'contents';
  }

  addTag(tag: Tag) {
    if (tag) this.tagIds.push(tag._id);
  }

  getSortOrder() {
    return this.meta.sortOrder;
  }

  setAuthor(author: Author) {
    this.setAuthor(author);
  }

  toModel(user?: User) {
    const ModelConstructor: Type<ContentModel> =
      'getModelConstructor' in this && typeof this.getModelConstructor === 'function'
        ? this.getModelConstructor()
        : ContentModel;

    return new ModelConstructor(this);
  }
}

export abstract class ContentType<
  T extends IContentEntity & BaseEntity<IContentEntity>,
  TContent extends ContentDataType = ContentDataType,
  TConfig extends Object = any,
  TModel extends ContentModel = ContentModel,
> extends Content<T, TContent, TConfig> {
  abstract toModel(user?: User): TModel;
}

export const ContentSchema = SchemaFactory.createForClass(Content);

export function getContentModelDefinition(definitions: ModelDefinition[]): ModelDefinition {
  return {
    name: Content.name,
    collection: Content.collectionName(),
    schema: ContentSchema,
    discriminators: definitions,
  };
}

//ContentSchema.index({ oid: 1, pid: 1, 'content.$**': 'text' });
