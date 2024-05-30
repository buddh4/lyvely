import { IPolicy } from '@/policies';
import { ProfileContext } from '../contexts';

/**
 * A policy which assures the user is an active profile member of the profile.
 *
 * @class
 * @implements IPolicy<ProfileContext>
 */
export class ProfileMembershipPolicy implements IPolicy<ProfileContext> {
  async verify(context: ProfileContext): Promise<boolean> {
    const { user } = context;
    if (!user) return false;

    return context.isActiveProfileMember();
  }
}
