import { Prop, SchemaFactory } from '@nestjs/mongoose';
import {
  BaseDocument,
  type BaseDocumentData,
  MixedProp,
  NestedSchema,
  ObjectIdProp,
  TObjectId,
} from '@/core';
import { PropertyType } from '@lyvely/common';

/**
 * Examples:
 *  - Marked as Issue
 *  - Updated by, at, revId
 *  - Added/Removed tags
 *  - Changed Visibility
 *  - Archived/Restored
 *  - Deleted
 *  - Shared
 *  - Moved
 *  - Referenced
 *  - Linked to other content
 *  - Locked
 *  - Attached file
 *  - Canceled (Event)
 *  - Closed (Poll)
 */

export enum BaseContentLogTypes {
  Updated = 'updated',
  AddedTags = 'addedTags',
  RemovedTags = 'removedTags',
  Visibility = 'visibility',
  Archived = 'archived',
  Locked = 'locked',
}

@NestedSchema()
export class ContentLog<TData = undefined> {
  @ObjectIdProp({ required: true })
  updatedBy?: TObjectId;

  @Prop({ type: Date, required: true })
  @PropertyType(Date, { default: () => new Date() })
  updatedAt: Date;

  @MixedProp()
  data: TData;

  @Prop({ required: true })
  type: string;

  _id: TObjectId;

  id: string;

  constructor(data: BaseDocumentData<ContentLog<TData>>) {
    BaseDocument.init(this, data);
  }
}

export const ContentLogSchema = SchemaFactory.createForClass(ContentLog);
