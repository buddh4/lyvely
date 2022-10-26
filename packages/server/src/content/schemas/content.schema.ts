import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { DeepPartial, IContent, PropertyType } from '@lyvely/common';
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
export class Content<T extends IContentEntity & BaseEntity<IContentEntity> = any>
  extends BaseProfileModel<T>
  implements IContent, BaseProfileModel<T>
{
  @Prop({ type: ContentDataTypeSchema })
  @PropertyType(ContentDataType)
  data: ContentDataType;

  @Prop({ type: ContentMetadataSchema })
  @PropertyType(ContentMetadata)
  meta: ContentMetadata;

  @Prop({ type: [ContentLogSchema], default: [] })
  @PropertyType([ContentLog])
  logs: ContentLog[];

  @Prop({ type: [mongoose.Types.ObjectId], default: [] })
  tagIds: TObjectId[];

  type: string;

  constructor(profile: Profile, createdBy: User, obj: DeepPartial<T> = {}) {
    obj.meta = obj.meta || new ContentMetadata();
    obj.meta.createdBy = createdBy._id;
    obj.meta.createdAs = obj.meta.createdAs || new CreatedAs(createdBy);
    obj.pid = profile._id;
    obj.oid = profile.oid;
    super(obj);
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
}

export const ContentSchema = SchemaFactory.createForClass(Content);
