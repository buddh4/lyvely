import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { DeepPartial, IContent, getNumberEnumValues } from 'lyvely-common';
import { BaseEntity, EntityType } from '../../db/base.entity';
import { ContentLog, ContentLogSchema } from './content-log.schema';
import { ContentVisibilityLevel } from '../../permissions/interfaces/profile-permissions.interface';
import { ContentMetadata, ContentMetadataSchema } from './content.metadata.schema';
import { CreatedAs, ContentAuthorSchema, Author } from './content-author-info.schema';
import { User } from '../../users';
import { implementsAssertContentMetadata } from '../interfaces';
import { Profile } from '../../profiles';

export type ContentDocument = Content & mongoose.Document<mongoose.Types.ObjectId>;

export interface ContentConstructor<T extends Content = any> extends Function {
  new (author?: User, profile?: Profile, obj?: Partial<T>): T;
}

export interface ContentEntity {
  createdBy: mongoose.Types.ObjectId;
  createdAs?: CreatedAs;
  pid: mongoose.Types.ObjectId;
  oid?: mongoose.Types.ObjectId;
  logs: ContentLog[];
  metaData: ContentMetadata;
  visibility: number;
  title?: string;
  text?: string;
  archived: boolean;
  categories: string[];
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

@Schema({ timestamps: true, discriminatorKey: 'type' })
export class Content<T extends EntityType<ContentEntity> = EntityType<ContentEntity>> extends BaseEntity<T> implements IContent {

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  createdBy: mongoose.Types.ObjectId;

  @Prop({ type: ContentAuthorSchema, required: true })
  createdAs?: CreatedAs;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  pid: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: false })
  oid?: mongoose.Types.ObjectId;

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

  @Prop({ type: [String], default: [] })
  categories: string[];

  type: string;

  createdAt: Date;

  updatedAt: Date;

  constructor(author: User, profile: Profile, obj: DeepPartial<T> = {}) {
    obj.createdBy = author._id;
    obj.createdAs = new CreatedAs(author);
    obj.pid = profile._id;
    super(obj);
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

  setAuthor(author: Author) {
    this.createdAs = new CreatedAs(author);
  }

  static collectionName() {
    return 'contents';
  }
}

export const ContentSchema = SchemaFactory.createForClass(Content);
