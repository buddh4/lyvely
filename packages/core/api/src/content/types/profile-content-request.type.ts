import { ProfileRequest, ProtectedProfileRequest } from '@/profiles';
import {
  Content,
  type MembershipProfileContentContext,
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

export type MemberProfileContentRequest<C extends Content = Content> = ProtectedProfileRequest<
  MembershipProfileContentContext<C>
> & {
  content: C;
};
