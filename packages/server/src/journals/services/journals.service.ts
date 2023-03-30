import { AbstractContentTypeService } from '@/content';
import { Journal } from '@/journals/schemas';
import { CreateJournalModel } from '@lyvely/common';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { JournalsDao } from '@/journals/daos';
import { Profile } from '@/profiles';
import { User } from '@/users';
import { UpdateQuerySet } from '@/core';

@Injectable()
export class JournalsService extends AbstractContentTypeService<Journal, CreateJournalModel> {
  @Inject()
  protected contentDao: JournalsDao;

  protected logger = new Logger(JournalsService.name);

  protected async createInstance(
    profile: Profile,
    user: User,
    model: CreateJournalModel,
  ): Promise<Journal> {
    const instance = Journal.create(profile, user, model);
    instance.meta.sortOrder = await this.contentDao.getNextSortOrder(profile);
    return instance;
  }

  protected async createUpdate(
    profile: Profile,
    user: User,
    content: Journal,
    model: Partial<CreateJournalModel>,
  ): Promise<UpdateQuerySet<Journal>> {
    return content.applyUpdate(model);
  }
}
