import { User } from '@/users';
import {
  IntegrityException,
  ProfileType,
  ProfileUsage,
  ProfileVisibilityLevel,
} from '@lyvely/interface';
import { UserProfile } from './user-profiles.schema';
import { GroupProfile } from './group-profiles.schema';
import { Organization } from './organization.schema';
import type { DocumentIdentity } from '../../core';

export interface ICreateProfileOptions {
  organization?: Organization | null;
  usage?: ProfileUsage[];
  visibility?: ProfileVisibilityLevel;
  name: string;
  handle?: string;
  description?: string;
  locale?: string;
}

export interface ICreateProfileTypeOptions extends ICreateProfileOptions {
  type: ProfileType;
}

const profileTypeMap = {
  [ProfileType.User]: UserProfile,
  [ProfileType.Group]: GroupProfile,
  [ProfileType.Organization]: Organization,
};

export function getProfileConstructorByType(type: ProfileType) {
  return profileTypeMap[type];
}

export class ProfilesFactory {
  static createProfile(owner: User, options: ICreateProfileTypeOptions) {
    const ProfileTypeClass = getProfileConstructorByType(options.type);

    if (!ProfileTypeClass) {
      throw new IntegrityException(
        'Could not create profile, invalid profile due to invalid profile type',
      );
    }

    if (options.organization && !options.organization.isOrganization()) {
      throw new IntegrityException(
        'Could not create a profile due to invalid organization profile type',
      );
    }

    return new ProfileTypeClass(owner, {
      name: options.name,
      handle: options.handle,
      locale: options.locale,
      visibility: options.visibility || ProfileVisibilityLevel.Member,
      description: options.description,
      usage: options.usage,
      type: options.type,
      oid: options.type === ProfileType.Organization ? undefined : options.organization?._id,
    });
  }
}
