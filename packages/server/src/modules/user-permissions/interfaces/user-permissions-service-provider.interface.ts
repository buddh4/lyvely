import { PermissionsService } from '../../permissions';
import { User } from '../../users';

export abstract class UserPermissionsServiceProvider extends PermissionsService<User> {}

export const UserPermissionsServiceInjectionToken: unique symbol = Symbol();
