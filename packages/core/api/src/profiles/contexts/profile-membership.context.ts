import { Profile, Membership } from '../schemas';
import { ProfileMembershipRole } from '@lyvely/interface';
import { ProtectedProfileContext } from './protected-profile.context';

/**
 * Represents a profile context for member users. This can be used on endpoints with a membership guard.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export interface ProfileMembershipContext<T extends Profile = Profile>
  extends ProtectedProfileContext<T> {
  getMembership(): Membership;
  getMembership(...roles: ProfileMembershipRole[]): Membership | undefined;
}
