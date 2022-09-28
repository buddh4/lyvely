import { Content } from '../schemas';
import { Inject } from '@nestjs/common';
import { AbstractContentService } from './abstract-content.service';
import { ContentDao } from '../daos';

export class ContentService extends AbstractContentService<Content> {
  @Inject()
  protected contentDao: ContentDao;
}
