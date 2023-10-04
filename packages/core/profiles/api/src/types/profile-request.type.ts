import { Request } from 'express';
import { Profile } from '../schemas';
import { ProfileContext, ProfileUserContext } from '../models';
import { RequestAdditions } from '@lyvely/core';
import { OptionalUserRequest, UserRequest } from '@lyvely/users';

export type ProfileRequest<TContext extends ProfileContext = ProfileContext> = Request<
  any,
  any,
  any,
  { pid: string } & Record<string, string>
> & {
  profile: Profile;
  context: TContext;
  csrfToken: () => string;
} & OptionalUserRequest &
  RequestAdditions;

export type ProfileUserRequest<TContext extends ProfileUserContext = ProfileUserContext> = Request<
  any,
  any,
  any,
  { pid: string } & Record<string, string>
> & {
  profile: Profile;
  context: TContext;
  csrfToken: () => string;
} & UserRequest &
  RequestAdditions;
