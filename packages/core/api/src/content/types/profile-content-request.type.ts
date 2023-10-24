import { ProfileRequest, ProtectedProfileRequest } from '@/profiles';
import { Content, ProfileContentContext, ProtectedProfileContentContext } from '../schemas';

export type ProfileContentRequest<C extends Content = Content> = ProfileRequest<
  ProfileContentContext<C>
> & { content: C };

export type ProtectedProfileContentRequest<C extends Content = Content> = ProtectedProfileRequest<
  ProtectedProfileContentContext<C>
> & { content: C };
