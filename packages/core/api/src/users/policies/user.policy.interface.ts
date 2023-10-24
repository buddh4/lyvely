import { IPolicy } from '@/policies';
import { IUserContext } from '../types';

export interface IUserPolicy<T extends IUserContext = IUserContext> extends IPolicy<T> {}
