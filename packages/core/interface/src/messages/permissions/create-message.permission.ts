import { IProfilePermission, ProfileRelationRole } from '@/profiles';
import { MESSAGES_MODULE_ID } from '@/messages';

export const CreateMessagePermission: IProfilePermission = {
  id: 'messages.create-message',
  moduleId: MESSAGES_MODULE_ID,
  global: false,
  default: ProfileRelationRole.Member,
  min: ProfileRelationRole.Moderator,
  max: ProfileRelationRole.User,
};
