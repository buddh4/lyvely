import { UserProfileRelation } from '../schemas';
import { AbstractUserProfileRelationsDao } from './abstract-user-profile-relations.dao';
import { Dao } from '@/core';
import { TenancyIsolation } from '@/core/tenancy';

@Dao(UserProfileRelation, { isolation: TenancyIsolation.Strict })
export class UserProfileRelationsDao extends AbstractUserProfileRelationsDao {}
