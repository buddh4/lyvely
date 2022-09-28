import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from '../../core/db/base.entity';
import { IContentMetadata } from '../interfaces';

/**
 * Other ideas:
 *
 * isSharable
 * isStreamable
 * isMovable
 */

@Schema()
export class ContentMetadata extends BaseEntity<ContentMetadata> implements IContentMetadata {
  @Prop()
  isArchivable?: boolean;

  @Prop()
  isDeletable?: boolean;

  @Prop()
  isEditable?: boolean;

  @Prop()
  isLocked?: boolean;

  @Prop()
  isCommentable?: boolean;

  @Prop()
  isReactable?: boolean;

  @Prop()
  isIssue?: boolean;
}

export const ContentMetadataSchema = SchemaFactory.createForClass(ContentMetadata);
