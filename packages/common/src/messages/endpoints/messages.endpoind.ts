import { IStreamService } from '@/stream';
import { MessageModel } from '@/messages';
import { Endpoint } from '@/endpoints';

export interface IMessagesService {}

export type MessagesEndpoint = Endpoint<IMessagesService>;
