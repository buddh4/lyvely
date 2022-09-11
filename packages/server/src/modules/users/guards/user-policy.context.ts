import { PolicyContext } from '../../policies/guards/policy-context';
import { UserRequest } from '../../../core/types';

export class UserPolicyContext<R extends UserRequest = UserRequest> extends PolicyContext<R> {}
