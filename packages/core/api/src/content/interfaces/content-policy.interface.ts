import { IProfilePolicy, IProfileUserPolicy } from '@/profiles';
import { ProfileContentContext, ProtectedProfileContentContext } from '../schemas';

export interface IContentPolicy<T extends ProfileContentContext = ProfileContentContext>
  extends IProfilePolicy<T> {}

export interface IUserContentPolicy<
  T extends ProtectedProfileContentContext = ProtectedProfileContentContext,
> extends IProfileUserPolicy<T> {}
