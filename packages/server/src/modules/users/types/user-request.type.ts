import { User } from '../schemas';
import { LyvelyRequest } from '@/modules/core';

export type UserRequest = LyvelyRequest & { user: User };
