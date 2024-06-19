import { ContentTypeDao } from '@/content';
import { SystemMessage } from '../schemas';
import { ProfileDao } from '@/profiles';

@ProfileDao(SystemMessage)
export class SystemMessagesDao extends ContentTypeDao<SystemMessage> {}
