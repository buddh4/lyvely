import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from '../../core/db/base.entity';

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

@Schema({ timestamps: { createdAt: true }, discriminatorKey: 'kind' })
export class ContentLog extends BaseEntity<ContentLog> {
  createdAt: string;
  kind: string;
}

export const ContentLogSchema = SchemaFactory.createForClass(ContentLog);
