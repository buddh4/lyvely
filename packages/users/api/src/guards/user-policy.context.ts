import { PolicyContext } from '@lyvely/policies';
import { UserRequest } from '../types';

export class UserPolicyContext<R extends UserRequest = UserRequest> extends PolicyContext<R> {}
