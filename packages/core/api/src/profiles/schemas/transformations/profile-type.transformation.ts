import type { IDocumentTransformation, LeanDoc } from '@/core';
import type { Profile } from '../profiles.schema';
import { ProfileType } from '@lyvely/interface';

const OLD_PROFILE_TYPES = ['UserProfile', 'GroupProfile', 'Organization'];

/**
 * This transformation transforms old profile type strings into current ProfileTypes.
 * Note: This is a very early pre beta transformation and can be removed in later versions.
 */
export class ProfileTypeTransformation implements IDocumentTransformation<Profile> {
  getId() {
    return 'Transform_old_profile_types';
  }
  condition(leanDoc: LeanDoc<Profile>): boolean {
    return OLD_PROFILE_TYPES.includes(leanDoc.type);
  }

  transform(leanDoc: LeanDoc<Profile>): LeanDoc<Profile> {
    leanDoc.type = this.transformType(leanDoc.type);
    return leanDoc;
  }

  private transformType(type: string): ProfileType {
    switch (type) {
      case 'UserProfile':
        return ProfileType.User;
      case 'GroupProfile':
        return ProfileType.Group;
      case 'Organization':
        return ProfileType.Organization;
      default:
        return type as ProfileType;
    }
  }
}
