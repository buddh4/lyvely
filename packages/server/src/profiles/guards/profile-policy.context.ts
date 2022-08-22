import { ProfileRequest } from '../../core/types';
import { UserPolicyContext } from '../../users';

export class ProfilePolicyContext<R extends ProfileRequest = ProfileRequest> extends UserPolicyContext<R> {}
