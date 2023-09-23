import { ProfileRequest } from '../types';
import { UserPolicyContext } from '@lyvely/users';

export class ProfilePolicyContext<R extends ProfileRequest = ProfileRequest> extends UserPolicyContext<R> {}
