import { ProfileRelationRole } from '@/profiles';
import { MESSAGES_MODULE_ID } from '@/messages/messages.constants';
import { createContentPermissions } from '@/content';
import { MessageModel } from '@/messages/models';

const Permissions = createContentPermissions(
  MessageModel.contentType,
  MESSAGES_MODULE_ID,
  undefined,
  {
    create: {
      default: ProfileRelationRole.Guest,
    },
  }
);

export const useMessagePermissions = () => Permissions;

export const MessagePermissions = [
  Permissions.Create,
  Permissions.Manage,
  Permissions.Write,
  Permissions.Delete,
];
