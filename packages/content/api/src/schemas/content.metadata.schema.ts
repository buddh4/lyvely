import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity, NestedSchema, ObjectIdProp } from '@lyvely/core';
import mongoose from 'mongoose';
import { Author, ContentAuthorSchema, CreatedAs } from './content-author.schema';
import { getNumberEnumValues, PropertyType } from '@lyvely/common';
import { IContentMetadata } from '@lyvely/content-interface';
import { RoleVisibilityLevel } from '@lyvely/profiles';

/**
 * Other ideas:
 *
 * isSharable
 * isStreamable
 * isMovable
 */

@NestedSchema()
export class ContentMetadata extends BaseEntity<ContentMetadata> implements IContentMetadata {
  @ObjectIdProp()
  mid?: mongoose.Types.ObjectId;

  @ObjectIdProp()
  parentId?: mongoose.Types.ObjectId;

  @Prop()
  parentPath?: string;

  @ObjectIdProp({ required: true })
  createdBy: mongoose.Types.ObjectId;

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

  @ObjectIdProp()
  updatedBy: mongoose.Types.ObjectId;

  @Prop({ required: true })
  streamSort: number;

  @Prop({ enum: getNumberEnumValues(RoleVisibilityLevel) })
  @PropertyType(Number, { default: RoleVisibilityLevel.Member })
  visibility: RoleVisibilityLevel;

  @Prop({ type: Number, min: 0 })
  sortOrder?: number;

  @Prop()
  archived?: boolean;

  @Prop()
  locked?: boolean;

  afterInit() {
    this.streamSort ??= Date.now();
    this.sortOrder ??= Date.now();
  }

  setAuthor(author: Author) {
    this.createdAs = new CreatedAs(author);
  }
}

export const ContentMetadataSchema = SchemaFactory.createForClass(ContentMetadata);
