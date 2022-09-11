import { ProfilePolicyContext } from '../../profiles';
import { ProfileContentRequest } from '../controllers';

export class ProfileContentContext<R extends ProfileContentRequest = ProfileContentRequest> extends ProfilePolicyContext<R> {}
