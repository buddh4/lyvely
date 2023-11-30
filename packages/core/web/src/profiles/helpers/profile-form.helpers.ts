import { ProfileType, ProfileVisibilityLevel } from '@lyvely/interface';
import { ISelectOptions } from '@lyvely/ui';
import { useProfileStore } from '@/profiles/stores';
import { useAuthStore } from '@/auth';

export interface IProfileVisibilityOptions {
  type?: ProfileType;
  hasOrg: boolean;
}

/**
 * Returns profile visibility options
 * @param options
 */
export function getProfileVisibilityOptions(options?: IProfileVisibilityOptions): ISelectOptions {
  const profile = useProfileStore().profile;

  const type = options?.type || profile?.type;
  const hasOrg = options?.hasOrg || profile?.hasOrg;

  const memberVisibilityLable =
    type === ProfileType.User ? 'profiles.visibility.me' : 'profiles.visibility.member';

  const visibilityOptions: ISelectOptions = [
    { label: memberVisibilityLable, value: ProfileVisibilityLevel.Member },
    { label: 'profiles.visibility.user', value: ProfileVisibilityLevel.User },
  ];

  if (hasOrg) {
    visibilityOptions.push({
      label: 'profiles.visibility.organization',
      value: ProfileVisibilityLevel.Organization,
    });
  }

  const visitorsAllowed = useAuthStore().isVisitorModeEnabled();

  if (visitorsAllowed) {
    visibilityOptions.push({
      label: 'profiles.visibility.visitor',
      value: ProfileVisibilityLevel.Visitor,
    });
  }

  return visibilityOptions;
}
