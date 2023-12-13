import { DocumentIdentity } from '@/core';
import { User } from './users.schema';

export type OptionalUser = User | null | undefined;
export type OptionalUserIdentity = DocumentIdentity<User> | null | undefined;
