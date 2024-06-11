import { ProfileRequest, ProtectedProfileRequest } from '@/profiles';
import {
  Content,
  type ProfileMembershipContentContext,
  ProfileContentContext,
  ProtectedProfileContentContext,
} from '../schemas';

export type ProfileOptionalContentRequest<C extends Content = Content> = ProfileRequest<
  ProfileContentContext<C>
> & { content?: C };

export type ProfileContentRequest<C extends Content = Content> = ProfileRequest<
  ProfileContentContext<C>
> & { content: C };

export type ProtectedProfileContentRequest<C extends Content = Content> = ProtectedProfileRequest<
  ProtectedProfileContentContext<C>
> & { content: C };

export type ProfileMemberContentRequest<C extends Content = Content> = ProtectedProfileRequest<
  ProfileMembershipContentContext<C>
> & {
  content: C;
};
