import { Prop, SchemaFactory } from '@nestjs/mongoose';
import {
  BaseDocument,
  type BaseDocumentData,
  NestedSchema,
  ObjectIdArrayProp,
  ObjectIdProp,
  type StrictBaseDocumentData,
  TObjectId,
} from '@/core';
import { Author, ContentAuthorSchema, CreatedAs } from './content-author.schema';
import { getNumberEnumValues, PropertyType } from '@lyvely/common';
import { IContentMetadata, RoleVisibilityLevel } from '@lyvely/interface';

@NestedSchema()
export class ContentMetadata implements IContentMetadata {
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

  @ObjectIdArrayProp()
  assignees?: TObjectId[];

  @ObjectIdArrayProp()
  managers?: TObjectId[];

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
  @PropertyType(Number, { default: Date.now() })
  streamSort: number;

  @Prop({ enum: getNumberEnumValues(RoleVisibilityLevel) })
  @PropertyType(Number, { default: RoleVisibilityLevel.Member })
  visibility: RoleVisibilityLevel;

  @Prop({ type: Number, min: 0 })
  @PropertyType(Number, { default: Date.now() })
  sortOrder?: number;

  @Prop()
  archived?: boolean;

  @Prop()
  deleted?: boolean;

  @Prop()
  locked?: boolean;

  id: string;

  _id: TObjectId;

  constructor(data: BaseDocumentData<ContentMetadata>) {
    BaseDocument.init(this, data);
  }

  setAuthor(author: Author) {
    this.createdAs = new CreatedAs(author);
  }
}

export const ContentMetadataSchema = SchemaFactory.createForClass(ContentMetadata);
