import { IProfilePolicy, IProfileUserPolicy } from '@lyvely/profiles';
import { ProfileContentContext, ProfileUserContentContext } from '../schemas';

export interface IContentPolicy<T extends ProfileContentContext = ProfileContentContext>
  extends IProfilePolicy<T> {}

export interface IUserContentPolicy<T extends ProfileUserContentContext = ProfileUserContentContext>
  extends IProfileUserPolicy<T> {}
