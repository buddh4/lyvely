import { Request } from 'express';
import { User } from '../users';
import { Profile, UserProfileRelations } from '../profiles';

type RequestAdditions = { csrfToken: (() => string) };

export type UserRequest = Request & { user: User } & RequestAdditions;
export type ProfileRequest = Request<any,any,any,{ pid: string }
  & Record<string,string>>
  & { profile: Profile, user: User, profileRelations: UserProfileRelations, csrfToken: (() => string) }
  & RequestAdditions;
