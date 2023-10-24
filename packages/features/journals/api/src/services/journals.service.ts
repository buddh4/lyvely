import { ContentTypeService } from '@lyvely/core';
import { Journal } from '../schemas';
import { CreateJournalModel } from '@lyvely/journals-interface';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { JournalsDao } from '../daos';
import { Profile } from '@lyvely/core';
import { User } from '@lyvely/core';
import { UpdateQuerySet } from '@lyvely/core';

@Injectable()
export class JournalsService extends ContentTypeService<Journal, CreateJournalModel> {
  @Inject()
  protected contentDao: JournalsDao;

  protected logger = new Logger(JournalsService.name);

  protected async createInstance(
    profile: Profile,
    user: User,
    model: CreateJournalModel,
  ): Promise<Journal> {
    return Journal.create(profile, user, model);
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
