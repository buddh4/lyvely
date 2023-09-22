import { TransformObjectId } from '@lyvely/models';
import { Exclude, Expose } from 'class-transformer';
import { BaseModel } from '@lyvely/models';
import type { IContent } from '@lyvely/content';

@Exclude()
export class MilestoneRelationModel extends BaseModel<MilestoneRelationModel> {
  @Expose()
  @TransformObjectId()
  pid: TObjectId;

  @Expose()
  @TransformObjectId()
  cid: TObjectId;

  @Expose()
  @TransformObjectId()
  mid: TObjectId;

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
