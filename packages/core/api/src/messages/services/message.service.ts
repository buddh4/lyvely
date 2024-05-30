import { ContentTypeService } from '@/content';
import { Message } from '../schemas';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { MessageDao } from '../daos';
import { ProtectedProfileContext } from '@/profiles';
import { CreateMessageModel } from '@lyvely/interface';
import { UpdateQuerySet } from '@/core';

/**
 * Represents a message service that handles the creation and updating of messages.
 * @extends ContentTypeService
 */
@Injectable()
export class MessageService extends ContentTypeService<Message, CreateMessageModel> {
  /** Message data access object (DAO). **/
  @Inject()
  protected contentDao: MessageDao;

  /** Class specific logger. **/
  protected logger = new Logger(MessageService.name);

  /**
   * Creates a new Message instance from the given create model.
   * This is part of the ContentTypeService template and is responsible for mapping create models to actual
   * model instances.
   *
   * @param {ProtectedProfileContext} context - The context object containing the profile and user information.
   * @param {CreateMessageModel} model - The model object containing the text for the message.
   * @protected
   * @returns {Promise<Message>} - A promise that resolves to a new instance of Message.
   */
  protected async createInstance(context: ProtectedProfileContext, model: CreateMessageModel) {
    return new Message(context, model.text);
  }

  /**
   * Creates and applies an update to a Message.
   * This is part of the ContentTypeService template and is responsible for mapping update models to actual
   * document updates.
   *
   * @param {ProtectedProfileContext} context - The context of the protected profile.
   * @param {Message} message - The message to update.
   * @param {Partial<CreateMessageModel>} model - The model containing the updated data.
   * @returns {Promise<UpdateQuerySet<Message>>} - A promise that resolves to the updated message.
   * @protected
   */
  protected async createUpdate(
    context: ProtectedProfileContext,
    message: Message,
    model: Partial<CreateMessageModel>
  ): Promise<UpdateQuerySet<Message>> {
    if (model.text) {
      message.content.text = model.text;
    }
    return message;
  }
}
