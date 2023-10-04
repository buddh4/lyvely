import { LyvelyRequest } from '@lyvely/core';
import { IOptionalUserContext, IUserContext } from './user.context';

export type UserRequest = LyvelyRequest & IUserContext;
export type OptionalUserRequest = LyvelyRequest & IOptionalUserContext;
