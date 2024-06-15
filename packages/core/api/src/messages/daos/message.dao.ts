import { ContentTypeDao } from '@/content';
import { Message } from '../schemas';
import { Dao } from '@/core';

@Dao(Message)
export class MessageDao extends ContentTypeDao<Message> {}
