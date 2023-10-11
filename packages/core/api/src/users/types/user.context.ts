import { User } from '../schemas';

export interface IUserContext {
  user: User;
}

export interface IOptionalUserContext {
  user?: User;
}
