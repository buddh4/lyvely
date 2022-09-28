import { Request } from 'express';
import { User } from '../schemas';
import { RequestAdditions } from '../../core/types';

export type UserRequest = Request & { user: User } & RequestAdditions;
