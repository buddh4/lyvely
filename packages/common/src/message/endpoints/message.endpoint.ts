import { StrictEndpoint } from '@/endpoints';
import { AbstractContentEndpoint } from '@/content';
import { CreateMessage, MessageModel } from '@/message';

export interface IMessageClient extends AbstractContentEndpoint {
  create(model: CreateMessage): Promise<MessageModel>;
}

export type MessageEndpoint = StrictEndpoint<IMessageClient>;

export const ENDPOINT_MESSAGE = 'messages';
