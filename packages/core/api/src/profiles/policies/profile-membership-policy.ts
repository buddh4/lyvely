import { IPolicy } from '@/policies';
import { ProfileContext } from '@/profiles';
import { ProfileContentContext } from '@/content';

/**
 * A policy which assures the user is an active profile member of the profile.
 *
 * @class
 * @implements IPolicy<ProfileContext>
 */
export class ProfileMembershipPolicy implements IPolicy<ProfileContext> {
  async verify(context: ProfileContentContext): Promise<boolean> {
    const { user } = context;
    if (!user) return false;

    return context.isActiveProfileMember();
  }
}
