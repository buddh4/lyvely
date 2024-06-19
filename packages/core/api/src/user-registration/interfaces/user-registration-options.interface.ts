import type { ModuleConfig } from '@/core';

export type IRegistrationModes = 'public' | 'invite' | 'none';

export interface IUserRegistrationOptions {
  mode?: IRegistrationModes;
}

export type UserRegistrationConfig = ModuleConfig<'user-registration', IUserRegistrationOptions>;
