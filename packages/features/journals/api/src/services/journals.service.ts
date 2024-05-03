import { ContentTypeService, UpdateQuerySet, ProtectedProfileContext } from '@lyvely/api';
import { Journal } from '../schemas';
import { CreateJournalModel } from '@lyvely/journals-interface';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { JournalsDao } from '../daos';

/**
 * Represents a service for managing Journal content.
 *
 * @implements {ContentTypeService<Journal, CreateJournalModel>}
 */
@Injectable()
export class JournalsService extends ContentTypeService<Journal, CreateJournalModel> {
  /** A Data Access Object (DAO) for Journals. **/
  @Inject()
  protected contentDao: JournalsDao;

  /** Class specific logger. **/
  protected logger = new Logger(JournalsService.name);

  /**
   * Creates a new Task instance from the given create model.
   * This is part of the ContentTypeService template and is responsible for mapping create models to actual
   * model instances.
   *
   * @param context
   * @param {CreateJournalModel} model - The model containing data for creating the journal.
   * @returns {Promise<Journal>} A Promise that resolves to the created Journal instance.
   * @protected
   */
  protected override async createInstance(
    context: ProtectedProfileContext,
    model: CreateJournalModel,
  ): Promise<Journal> {
    return Journal.create(context, model);
  }

  /**
   * Creates and applies an update to a Journal.
   * This is part of the ContentTypeService template and is responsible for mapping update models to actual
   * document updates.
   *
   * @param context
   * @param {Journal} content - The current journal content.
   * @param {Partial<CreateJournalModel>} model - The update model containing the fields to update.
   */
  protected override async createUpdate(
    context: ProtectedProfileContext,
    content: Journal,
    model: Partial<CreateJournalModel>,
  ): Promise<UpdateQuerySet<Journal>> {
    return content.applyUpdate(model);
  }
}
