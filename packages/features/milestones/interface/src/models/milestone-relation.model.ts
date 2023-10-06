import { TransformObjectId, BaseModel } from '@lyvely/common';
import { Exclude, Expose } from 'class-transformer';
import type { IContent } from '@lyvely/content-interface';

@Exclude()
export class MilestoneRelationModel<TID = string> extends BaseModel<MilestoneRelationModel<any>> {
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

  constructor(content: IContent<any>, progress?: { progress: number; tid?: string } | number) {
    super({
      pid: content.pid,
      cid: content.id,
      mid: content.meta.mid,
      title: content.getTitle() || content.getText(),
      text: content.getText()?.substring(0, 150),
      contentType: content.type,
      progress: typeof progress === 'number' ? progress : progress?.progress,
      tid: typeof progress === 'object' ? progress?.tid : undefined,
    });
  }
}
