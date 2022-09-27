import { User } from "../../users";
import { ProfileType } from "@lyvely/common";
import { UserProfile } from "./user-profiles.schema";
import { GroupProfile } from "./group-profiles.schema";
import { Organization } from "./organization.schema";
import { IntegrityException } from "../../core/exceptions";
import { ProfileUsage } from "@lyvely/common";

export interface CreateProfileOptions {
  organization?: Organization,
  usage?: ProfileUsage[],
  name: string,
  description?: string,
  locale?: string,
}

export interface CreateProfileTypeOptions extends CreateProfileOptions {
  type: ProfileType
}

const profileTypeMap = {
  [ProfileType.User]: UserProfile,
  [ProfileType.Group]: GroupProfile,
  [ProfileType.Organization]: Organization,
}

export function getProfileConstructorByType(type: ProfileType) {
  return profileTypeMap[type];
}

export class ProfilesFactory {
  static createProfile(owner: User, options: CreateProfileTypeOptions) {
    const ProfileTypeClass = getProfileConstructorByType(options.type);

    if (!ProfileTypeClass) {
      throw new IntegrityException('Could not create profile, invalid profile due to invalid profile type');
    }

    if(options.organization && !(options.organization instanceof Organization)) {
      throw new IntegrityException('Could not create a profile due to invalid organization profile type');
    }

    return new ProfileTypeClass(owner, {
      name: options.name,
      locale: options.locale,
      description: options.description,
      usage: options.usage,
      type: options.type,
      oid: (options.type === ProfileType.Organization) ? undefined : options.organization?._id
    })
  }
}
