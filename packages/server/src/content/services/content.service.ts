import { Content } from '../schemas/content.schema';
import { Inject } from '@nestjs/common';
import { AbstractContentService } from './abstract-content.service';
import { ContentDao } from '../daos/content.dao';

export class ContentService extends AbstractContentService<Content>{

  @Inject()
  protected contentDao: ContentDao;

  public async findContentById(id: string): Promise<Content> {
    return this.contentDao.findById(id);
  }
}