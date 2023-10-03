import { ProfileRequest, ProfileUserRequest } from '@lyvely/profiles';
import { Content, ProfileContentContext, ProfileUserContentContext } from '../schemas';

export type ProfileContentRequest<C extends Content = Content> =
  ProfileRequest<ProfileContentContext> & { content: C };

export type ProfileUserContentRequest<C extends Content = Content> =
  ProfileUserRequest<ProfileUserContentContext> & { content: C };
