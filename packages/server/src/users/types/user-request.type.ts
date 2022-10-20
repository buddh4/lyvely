import { User } from '../schemas';
import { LyvelyRequest } from '@/core';

export type UserRequest = LyvelyRequest & { user: User };
