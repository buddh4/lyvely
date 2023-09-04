export enum UserRegistrationMode {
  Public = 'public',
  Invite = 'invite',
  None = 'none',
}

export interface UserRegistrationConfig {
  mode: UserRegistrationMode;
}
