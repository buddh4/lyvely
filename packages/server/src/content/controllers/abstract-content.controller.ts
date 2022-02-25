import { Param, Post, Request } from '@nestjs/common';
import { Content } from '../schemas';
import { AbstractContentService } from '../services/abstract-content.service';

export abstract class AbstractContentController<T extends Content> {
  constructor(protected contentService: AbstractContentService<T>) {}

  @Post(':id/archive')
  async archive(@Request() req, @Param('id') id) {
    return { success: await this.contentService.archive(req.user, id) };
  }

  @Post(':id/unarchive')
  async unArchive(@Request() req, @Param('id') id) {
    return { success: await this.contentService.unarchive(req.user, id) };
  }

}