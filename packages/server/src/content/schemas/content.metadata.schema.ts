import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from '@/core';
import mongoose from 'mongoose';
import { Author, ContentAuthorSchema, CreatedAs } from '@/content/schemas/content-author.schema';
import {
  ContentVisibilityLevel,
  getNumberEnumValues,
  PropertyType,
  IContentMetadata,
} from '@lyvely/common';

/**
 * Other ideas:
 *
 * isSharable
 * isStreamable
 * isMovable
 */

@Schema({ _id: false })
export class ContentMetadata extends BaseEntity<ContentMetadata> implements IContentMetadata {
  @Prop({ type: mongoose.Types.ObjectId })
  parentId?: TObjectId;

  @Prop({ type: mongoose.Types.ObjectId })
  parentPath?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  createdBy: TObjectId;

  @Prop({ type: ContentAuthorSchema, required: true })
  createdAs?: CreatedAs;

  @Prop()
  @PropertyType(Number, { default: 0 })
  childCount: number;

  @Prop({ type: Date })
  @PropertyType(Date, { default: new Date() })
  createdAt: Date;

  @Prop({ type: Date })
  @PropertyType(Date, { default: new Date() })
  updatedAt: Date;

  @Prop({ required: true })
  @PropertyType(Number)
  streamSort: number;

  @Prop({ enum: getNumberEnumValues(ContentVisibilityLevel) })
  @PropertyType(Number, { default: ContentVisibilityLevel.Member })
  visibility: ContentVisibilityLevel;

  @Prop({ type: Number, min: 0 })
  sortOrder?: number;

  @Prop()
  isArchived?: boolean;

  @Prop()
  isLocked?: boolean;

  afterInit() {
    this.streamSort ||= Date.now();
  }

  setAuthor(author: Author) {
    this.createdAs = new CreatedAs(author);
  }
}

export const ContentMetadataSchema = SchemaFactory.createForClass(ContentMetadata);
