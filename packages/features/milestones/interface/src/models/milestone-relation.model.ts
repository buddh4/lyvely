import { TransformObjectId, BaseModel, hasOwnNonNullableProperty } from '@lyvely/common';
import { Exclude, Expose } from 'class-transformer';
import type { IContent } from '@lyvely/interface';

@Exclude()
export class MilestoneRelationModel<TID = string> {
  @Expose()
  @TransformObjectId()
  pid: TID;

  @Expose()
  @TransformObjectId()
  cid: TID;

  @Expose()
  @TransformObjectId()
  mid: TID;

  @Expose()
  title: string;

  @Expose()
  text?: string;

  @Expose()
  contentType: string;

  @Expose()
  tid?: string;

  @Expose()
  progress?: number;

  constructor(content: IContent, progress?: { progress: number; tid?: string } | number) {
    BaseModel.init<MilestoneRelationModel<any>>(this, {
      pid: content.pid,
      cid: content.id,
      mid: content.meta.mid,
      title: content.getTitle() || content.getText(),
      text: content.getText()?.substring(0, 150),
      contentType: content.type,
      progress: typeof progress === 'number' ? progress : progress?.progress,
      tid: hasOwnNonNullableProperty<{ progress: number; tid?: string }, 'tid'>(progress, 'tid')
        ? progress?.tid
        : undefined,
    });
  }
}
