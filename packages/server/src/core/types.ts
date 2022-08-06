import { Request } from 'express';
import { User } from '../users';
import { Profile, UserProfileRelations } from '../profiles';

export type UserRequest = Request & { user: User };
export type UserProfileRequest = Request<any,any,any,{ pid: string }
  & Record<string,string>>
  & { profile: Profile, user: User, profileRelations: UserProfileRelations };
