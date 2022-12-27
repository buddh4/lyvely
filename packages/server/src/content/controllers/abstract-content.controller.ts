import { Post, Request } from '@nestjs/common';
import { Content } from '../schemas';
import { AbstractContentService } from '../services';
import { ProfileContentRequest } from '../types';
import { Policies } from '@/policies';
import { ContentWritePolicy } from '../policies';
import { AbstractContentEndpoint, CreateContentModel } from '@lyvely/common';

export abstract class AbstractContentController<
  T extends Content,
  TModel extends CreateContentModel = any,
> implements AbstractContentEndpoint
{
  protected abstract contentService: AbstractContentService<T, TModel>;

  @Post(':cid/archive')
  @Policies(ContentWritePolicy)
  async archive(@Request() req: ProfileContentRequest<T>) {
    const { context, content } = req;
    return { success: await this.contentService.archive(context, content) };
  }

  @Post(':cid/unarchive')
  @Policies(ContentWritePolicy)
  async unArchive(@Request() req: ProfileContentRequest<T>) {
    const { context, content } = req;
    return { success: await this.contentService.unarchive(context, content) };
  }
}
