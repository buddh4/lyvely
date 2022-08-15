import { ProfileRequest } from '../../core/types';
import { UserPolicyContext } from '../../users/guards/user-policy.context';

export class ProfilePolicyContext<R extends ProfileRequest = ProfileRequest> extends UserPolicyContext<R> {}
