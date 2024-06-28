import { ContentTypeDao } from '@/content';
import { Message } from '../schemas';
import { Dao } from '@/core';
import { ProfileDao } from '@/profiles';

@ProfileDao(Message)
export class MessageDao extends ContentTypeDao<Message> {}
