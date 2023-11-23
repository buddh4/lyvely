import { StrictEndpoint } from '@lyvely/common';
import { IContentTypeClient } from '@/content';
import { CreateMessageModel, MessageModel } from '../models';

export interface IMessageClient extends IContentTypeClient<MessageModel, CreateMessageModel> {}

export type MessageEndpoint = StrictEndpoint<IMessageClient>;

export const ENDPOINT_MESSAGE = 'messages';
