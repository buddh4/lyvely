import { ContentTypeDao } from '@/content';
import { SystemMessage } from '../schemas';
import { Dao } from '@/core';

@Dao(SystemMessage)
export class SystemMessagesDao extends ContentTypeDao<SystemMessage> {}
