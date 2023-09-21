import { StrictEndpoint } from '@/endpoints';
import { IContentTypeService } from '@lyvely/content';
import { CreateMessage, MessageModel } from '../models';

export interface IMessageClient extends IContentTypeService<MessageModel, CreateMessage> {}

export type MessageEndpoint = StrictEndpoint<IMessageClient>;

export const ENDPOINT_MESSAGE = 'messages';
