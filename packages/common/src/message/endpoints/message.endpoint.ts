import { StrictEndpoint } from '@/endpoints';
import { IAbstractContentService } from '@/content';
import { CreateMessage, MessageModel } from '../models';

export interface IMessageClient extends IAbstractContentService<MessageModel, CreateMessage> {}

export type MessageEndpoint = StrictEndpoint<IMessageClient>;

export const ENDPOINT_MESSAGE = 'messages';
