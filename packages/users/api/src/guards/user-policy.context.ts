import { PolicyContext } from '@lyvely/policy';
import { UserRequest } from '../types';

export class UserPolicyContext<R extends UserRequest = UserRequest> extends PolicyContext<R> {}
