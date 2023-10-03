import { ProfileRequest, ProfileUserRequest } from '@lyvely/profiles';
import { Content } from '../schemas';
import { ProfileContentContext, ProfileUserContentContext } from '../models';

export type ProfileContentRequest<C extends Content = Content> =
  ProfileRequest<ProfileContentContext> & { content: C };

export type ProfileUserContentRequest<C extends Content = Content> =
  ProfileUserRequest<ProfileUserContentContext> & { content: C };
