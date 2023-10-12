import { IPolicy } from '@/policies';
import { ProfileContext, ProtectedProfileContext } from '../models';

export interface IProfilePolicy<T extends ProfileContext = ProfileContext> extends IPolicy<T> {}
export interface IProfileUserPolicy<T extends ProtectedProfileContext = ProtectedProfileContext>
  extends IPolicy<T> {}
