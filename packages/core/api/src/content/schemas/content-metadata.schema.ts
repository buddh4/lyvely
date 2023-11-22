import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity, NestedSchema, ObjectIdProp, TObjectId } from '@/core';
import { Author, ContentAuthorSchema, CreatedAs } from './content-author.schema';
import { getNumberEnumValues, PropertyType } from '@lyvely/common';
import { IContentMetadata, RoleVisibilityLevel } from '@lyvely/interface';

@NestedSchema()
export class ContentMetadata extends BaseEntity<ContentMetadata> implements IContentMetadata {
  @ObjectIdProp()
  mid?: TObjectId;

  @ObjectIdProp()
  parentId?: TObjectId;

  @Prop()
  parentPath?: string;

  @ObjectIdProp({ required: true })
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

  @ObjectIdProp()
  updatedBy: TObjectId;

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
  deleted?: boolean;

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
