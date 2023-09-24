import { ProfilePolicyContext } from '@lyvely/profiles';
import { ProfileContentRequest } from '../types';

export class ProfileContentContext<
  R extends ProfileContentRequest = ProfileContentRequest,
> extends ProfilePolicyContext<R> {}
