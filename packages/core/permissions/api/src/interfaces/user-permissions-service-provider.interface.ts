import { PermissionsService } from './permissions.service';
import { User } from '@lyvely/users';

export abstract class UserPermissionsServiceProvider extends PermissionsService<User> {}

export const UserPermissionsServiceInjectionToken: unique symbol = Symbol();
