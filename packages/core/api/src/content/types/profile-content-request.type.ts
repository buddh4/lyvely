import { ProfileRequest, ProfileUserRequest } from '@/profiles';
import { Content, ProfileContentContext, ProfileUserContentContext } from '../schemas';

export type ProfileContentRequest<C extends Content = Content> = ProfileRequest<
  ProfileContentContext<C>
> & { content: C };

export type ProfileUserContentRequest<C extends Content = Content> = ProfileUserRequest<
  ProfileUserContentContext<C>
> & { content: C };
