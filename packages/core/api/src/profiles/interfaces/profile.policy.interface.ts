import { IPolicy } from '@/policies/interfaces';
import { ProfileContext, ProtectedProfileContext } from '../models/profile.context';

export interface IProfilePolicy<T extends ProfileContext = ProfileContext> extends IPolicy<T> {}
export interface IProfileUserPolicy<T extends ProtectedProfileContext = ProtectedProfileContext>
  extends IPolicy<T> {}
