import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from '@/core';
import mongoose from 'mongoose';
import { Author, ContentAuthorSchema, CreatedAs } from '@/content/schemas/content-author.schema';
import { ContentVisibilityLevel, getNumberEnumValues, PropertyType, IContentMetadata } from '@lyvely/common';

/**
 * Other ideas:
 *
 * isSharable
 * isStreamable
 * isMovable
 */

@Schema({ id: false })
export class ContentMetadata extends BaseEntity<ContentMetadata> implements IContentMetadata {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  createdBy: TObjectId;

  @Prop({ type: ContentAuthorSchema, required: true })
  createdAs?: CreatedAs;

  @Prop({ type: Date })
  @PropertyType(Date, { default: new Date() })
  createdAt: Date;

  @Prop({ type: Date })
  @PropertyType(Date, { default: new Date() })
  updatedAt: Date;

  @Prop({ type: Date, required: true })
  @PropertyType(Date, { default: new Date() })
  streamSort: Date;

  @Prop({ enum: getNumberEnumValues(ContentVisibilityLevel) })
  @PropertyType(Number, { default: ContentVisibilityLevel.Member })
  visibility: ContentVisibilityLevel;

  @Prop({ type: Number, min: 0 })
  sortOrder?: number;

  @Prop()
  isArchived?: boolean;

  @Prop()
  isLocked?: boolean;

  setAuthor(author: Author) {
    this.createdAs = new CreatedAs(author);
  }

  /*

   In the future we could make the following meta:
  @Prop()
  isArchivable?: boolean;

  @Prop()
  isDeletable?: boolean;

  @Prop()
  isEditable?: boolean;

  @Prop()
  isCommentable?: boolean;

  @Prop()
  isReactable?: boolean;
  */
}

export const ContentMetadataSchema = SchemaFactory.createForClass(ContentMetadata);
