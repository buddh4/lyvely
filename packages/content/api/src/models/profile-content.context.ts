import { Profile, ProfileUserContext, ProfileContext } from '@lyvely/profiles';
import { Content } from '../schemas';

export class ProfileContentContext<
  TContent extends Content = Content,
  TProfile extends Profile = Profile,
> extends ProfileContext<TProfile> {
  content: TContent;
}

export class ProfileUserContentContext<
  TContent extends Content = Content,
  TProfile extends Profile = Profile,
> extends ProfileUserContext<TProfile> {
  content: TContent;
}
