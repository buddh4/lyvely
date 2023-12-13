import { IContentPermissionObject } from '@/content/permissions';
import { IPermissionSetting } from '@/permissions';
import { BaseModel } from '@lyvely/common';
import { ContentModel } from '@/content';
import { IProfilePermissionData, ProfileModel } from '@/profiles';

/**
 * Represents a content permission object which is used to verify the access of a permission subject.
 */
export class ContentPermissionObject
  extends BaseModel<ContentPermissionObject>
  implements IContentPermissionObject
{
  content: ContentModel<any>;
  profile: ProfileModel<any>;

  getPermissionSettings(): IPermissionSetting[] {
    return this.profile.getPermissionSettings();
  }

  getPermissionGroups(): string[] {
    return this.profile.getPermissionGroups();
  }

  getProfilePermissionData(): IProfilePermissionData {
    return this.profile;
  }
}
