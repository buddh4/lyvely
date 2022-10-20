import { Post, Request } from '@nestjs/common';
import { Content } from '../schemas';
import { AbstractContentService } from '../services';
import { ProfileContentRequest } from '../types';
import { Policies } from '../../policies/decorators/policies.decorator';
import { ContentWritePolicy } from '../policies';

export abstract class AbstractContentController<T extends Content> {
  constructor(protected contentService: AbstractContentService<T>) {}

  @Post(':cid/archive')
  @Policies(ContentWritePolicy)
  async archive(@Request() req: ProfileContentRequest<T>) {
    const { profileRelations, content } = req;
    return { success: await this.contentService.archive(profileRelations, content) };
  }

  @Post(':cid/unarchive')
  @Policies(ContentWritePolicy)
  async unArchive(@Request() req: ProfileContentRequest<T>) {
    const { profileRelations, content } = req;
    return { success: await this.contentService.unarchive(profileRelations, content) };
  }
}
