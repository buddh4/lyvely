import { IPolicy } from '@/policies';
import { IOptionalUserContext, IUserContext } from '../types';

export interface IOptionalUserPolicy<T extends IOptionalUserContext = IOptionalUserContext>
  extends IPolicy<T> {}
export interface IUserPolicy<T extends IUserContext = IUserContext> extends IPolicy<T> {}
