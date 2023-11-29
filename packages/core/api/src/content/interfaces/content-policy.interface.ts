import { IProfilePolicy, IProfileUserPolicy, Profile } from '@/profiles';
import { Content, ProfileContentContext, ProtectedProfileContentContext } from '../schemas';

export interface IContentPolicy<
  TContent extends Content = Content,
  TProfile extends Profile = Profile,
  T extends ProfileContentContext<TContent, TProfile> = ProfileContentContext<TContent, TProfile>,
> extends IProfilePolicy<T> {}

export interface IContentUserPolicy<
  T extends ProtectedProfileContentContext = ProtectedProfileContentContext,
> extends IProfileUserPolicy<T> {}
