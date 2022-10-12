import { Request } from 'express';
import { Profile } from '../schemas';
import { User } from '../../users';
import { ProfileContext } from '../models';
import { RequestAdditions } from '@/modules/core';

export type ProfileRequest = Request<any, any, any, { pid: string } & Record<string, string>> & {
  profile: Profile;
  user: User;
  profileRelations: ProfileContext;
  csrfToken: () => string;
} & RequestAdditions;
