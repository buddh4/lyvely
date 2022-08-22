import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { DeepPartial, IContent, getNumberEnumValues } from '@lyvely/common';
import { BaseEntity } from '../../db/base.entity';
import { ContentLog, ContentLogSchema } from './content-log.schema';
import { ContentVisibilityLevel } from '../../permissions/interfaces/profile-permissions.interface';
import { ContentMetadata, ContentMetadataSchema } from './content.metadata.schema';
import { CreatedAs, ContentAuthorSchema, Author } from './content-author-info.schema';
import { User } from '../../users';
import { implementsAssertContentMetadata } from '../interfaces';
import { Profile, BaseProfileModel } from '../../profiles';
import { Tag } from "../../tags";

export type ContentDocument = Content & mongoose.Document;

export interface ContentConstructor<T extends Content = any> extends Function {
  new (profile?: Profile, author?: User, obj?: Partial<T>): T;
}

export interface ContentEntity {
  _id: TObjectId;
  createdBy: TObjectId;
  createdAs?: CreatedAs;
  pid: TObjectId;
  oid?: TObjectId;
  logs: ContentLog[];
  metaData: ContentMetadata;
  visibility: number;
  title?: string;
  text?: string;
  archived: boolean;
  tagIds: TObjectId[];
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

@Schema({ timestamps: true, discriminatorKey: 'type' })
export class Content<T extends ContentEntity & BaseEntity<ContentEntity> = any> extends BaseProfileModel<T> implements IContent {

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  createdBy: TObjectId;

  @Prop({ type: ContentAuthorSchema, required: true })
  createdAs?: CreatedAs;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: false })
  oid: TObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  pid: TObjectId;

  @Prop({ type: [ContentLogSchema], default: [] })
  logs: ContentLog[];

  @Prop({ type: ContentMetadataSchema,  })
  metaData: ContentMetadata;

  @Prop( { enum: getNumberEnumValues(ContentVisibilityLevel), default: ContentVisibilityLevel.Member })
  visibility: number;

  @Prop()
  title?: string;

  @Prop()
  text?: string;

  @Prop({ default: false })
  archived: boolean;

  @Prop({ type: [mongoose.Types.ObjectId], default: [] })
  tagIds: TObjectId[];

  type: string;

  createdAt: Date;

  updatedAt: Date;

  constructor(profile: Profile, author: User, obj: DeepPartial<T> = {}) {
    const additionalData = {
      createdBy: author._id,
      createdAs: new CreatedAs(author),
      pid: profile._id,
      oid: profile.oid
    }
    super({ ...obj, ...additionalData });
  }

  afterInit() {
    this.metaData = new ContentMetadata(this.metaData);
    if(implementsAssertContentMetadata(this)) {
      this.assertContentMetadata(this.metaData);
    }

    if(this.logs?.length) {
      this.logs = this.logs.map(log => new ContentLog(log));
    }

    if(this.createdAs && !(this.createdAs instanceof CreatedAs)) {
      this.createdAs = new CreatedAs(this.createdAs);
    }

    super.afterInit();
  }

  addTag(tag: Tag) {
    if(tag) this.tagIds.push(tag._id);
  }

  setAuthor(author: Author) {
    this.createdAs = new CreatedAs(author);
  }

  static collectionName() {
    return 'contents';
  }
}

export const ContentSchema = SchemaFactory.createForClass(Content);
