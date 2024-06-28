import type { ModuleConfig } from '@/core';

export interface IUserInvitationsOptions {
  maxPerWeek?: number;
}

export type UserInvitationsConfig = ModuleConfig<'user-invitations', IUserInvitationsOptions>;
