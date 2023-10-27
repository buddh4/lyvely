import { EntityIdentity } from '@/core';
import { User } from './users.schema';

export type OptionalUser = User | null | undefined;
export type OptionalUserIdentity = EntityIdentity<User> | null | undefined;
