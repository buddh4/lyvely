import { Request } from 'express';
import { Profile } from '../schemas';
import { User } from '../../users';
import { ProfileContext } from '../models';
import { RequestAdditions } from '@lyvely/server-core';

export type ProfileRequest = Request<any, any, any, { pid: string } & Record<string, string>> & {
  profile: Profile;
  user: User;
  context: ProfileContext;
  csrfToken: () => string;
} & RequestAdditions;
