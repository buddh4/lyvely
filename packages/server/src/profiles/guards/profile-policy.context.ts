import { UserProfileRequest } from '../../core/types';
import { UserPolicyContext } from '../../users/guards/user-policy.context';

export class ProfilePolicyContext<R extends UserProfileRequest = UserProfileRequest> extends UserPolicyContext<R> {}