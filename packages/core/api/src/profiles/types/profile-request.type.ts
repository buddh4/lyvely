import { Request } from 'express';
import { Profile } from '../schemas';
import { ProfileContext, ProfileMembershipContext, ProtectedProfileContext } from '../models';
import { RequestAdditions } from '@/core';
import { OptionalUserRequest, UserRequest } from '@/users';

export type ProfileRequest<TContext extends ProfileContext = ProfileContext> = Request<
  any,
  any,
  any,
  { pid: string; oid?: string } & Record<string, string>
> & {
  profile: Profile;
  context: TContext;
  csrfToken: () => string;
} & OptionalUserRequest &
  RequestAdditions;

export type ProtectedProfileRequest<
  TContext extends ProtectedProfileContext = ProtectedProfileContext,
> = Request<any, any, any, { pid: string; oid?: string } & Record<string, string>> & {
  profile: Profile;
  context: TContext;
  csrfToken: () => string;
} & UserRequest &
  RequestAdditions;

export type ProfileMembershipRequest<
  TContext extends ProfileMembershipContext = ProfileMembershipContext,
> = Request<any, any, any, { pid: string; oid?: string } & Record<string, string>> & {
  profile: Profile;
  context: TContext;
  csrfToken: () => string;
} & UserRequest &
  RequestAdditions;
