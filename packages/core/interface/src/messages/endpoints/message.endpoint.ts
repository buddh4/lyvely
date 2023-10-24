import { StrictEndpoint } from '@lyvely/common';
import { IContentTypeService } from '@/content';
import { CreateMessageModel, MessageModel } from '../models';

export interface IMessageClient extends IContentTypeService<MessageModel, CreateMessageModel> {}

export type MessageEndpoint = StrictEndpoint<IMessageClient>;

export const ENDPOINT_MESSAGE = 'messages';
