export enum UserStatus {
  Disabled, // Manually disabled by system or admin
  Active, // Active state, after successful registration
  EmailVerification, // Email verification required
  Locked, // User is temporarily locked
}
