import { ContentType, ContentTypeService } from '@/content';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { SystemMessagesDao } from '../daos';
import { ProtectedProfileContext } from '@/profiles';
import { UnsupportedOperationException } from '@lyvely/interface';
import { SystemMessage, SystemMessageContent } from '../schemas';
import { UpdateQuerySet } from '@/core';
import { ICreateSystemMessage } from '../interfaces';

/**
 * Service class for managing system messages.
 *
 * @extends ContentTypeService
 */
@Injectable()
export class SystemMessagesService extends ContentTypeService<SystemMessage, ICreateSystemMessage> {
  /** SystemMessages content dao, responsible for data access. **/
  @Inject()
  protected contentDao: SystemMessagesDao;

  /** Class specific logger. **/
  protected logger = new Logger(SystemMessagesService.name);

  /**
   * Creates a new SystemMessage instance from the given create model.
   * This is part of the ContentTypeService template and is responsible for mapping create models to actual
   * model instances.
   *
   * @param {ProtectedProfileContext} context - The profile context.
   * @param {ICreateSystemMessage} model - The data for creating the task.
   * @returns {Promise<SystemMessage>} - The newly created task instance with the assigned sort order.
   * @protected
   */
  protected async createInstance(
    context: ProtectedProfileContext,
    model: ICreateSystemMessage,
  ): Promise<SystemMessage> {
    const { text, title, params } = model;
    return new SystemMessage(context, {
      content: new SystemMessageContent({ text, title, params }),
    });
  }

  /**
   * SystemMessage does not support updates.
   * @protected
   */
  protected createUpdate(): Promise<UpdateQuerySet<SystemMessage>> {
    throw new UnsupportedOperationException();
  }
}
