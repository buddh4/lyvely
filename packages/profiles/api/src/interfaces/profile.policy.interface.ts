import { IPolicy } from '@lyvely/policies';
import { ProfileContext, ProfileUserContext } from '../models';

export interface IProfilePolicy<T extends ProfileContext = ProfileContext> extends IPolicy<T> {}
export interface IProfileUserPolicy<T extends ProfileUserContext = ProfileUserContext>
  extends IPolicy<T> {}
