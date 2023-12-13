import { IProfilePermission, ProfileRelationRole } from '@/profiles';
import { MESSAGES_MODULE_ID } from '@/messages/messages.constants';
import { BasePermissionType } from '@/permissions';

/**
 * @typedef {Object} CreateMessagePermission
 * @property {string} id - The ID of the permission.
 * @property {string} moduleId - The ID of the module.
 * @property {string} type - The type of the permission.
 * @property {string} default - The default role for this permission.
 * @property {string} min - The minimum role for this permission.
 * @property {string} max - The maximum role for this permission.
 **/
export const CreateMessagePermission: IProfilePermission = {
  id: 'messages.create-message',
  moduleId: MESSAGES_MODULE_ID,
  name: 'messages.permissions.create.name',
  description: 'messages.permissions.create.description',
  type: BasePermissionType.Profile,
  default: ProfileRelationRole.Guest,
  min: ProfileRelationRole.Moderator,
  max: ProfileRelationRole.User,
};
