import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity, NestedSchema } from '@lyvely/core';
import mongoose from 'mongoose';
import { PropertyType, IContentLog } from '@lyvely/models';

/**
 * Examples:
 *  - Marked as Issue
 *  - Updated by, at, revId
 *  - Added/Removed tags
 *  - Changed Visibility
 *  - Archived/Unarchived
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
export class ContentLog<TData = undefined> extends BaseEntity<IContentLog<TData>> {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: false })
  updatedBy?: TObjectId;

  @Prop({ type: Date, required: true })
  @PropertyType(Date, { default: new Date() })
  updatedAt: Date;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  data: TData;

  @Prop({ required: true })
  type: string;
}

export const ContentLogSchema = SchemaFactory.createForClass(ContentLog);
