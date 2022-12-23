import { Post, Request } from '@nestjs/common';
import { Content } from '../schemas';
import { AbstractContentService } from '../services';
import { ProfileContentRequest } from '../types';
import { Policies } from '@/policies';
import { ContentWritePolicy } from '../policies';
import { AbstractContentEndpoint } from '@lyvely/common';

export abstract class AbstractContentController<T extends Content>
  implements AbstractContentEndpoint
{
  protected abstract contentService: AbstractContentService<T>;

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
