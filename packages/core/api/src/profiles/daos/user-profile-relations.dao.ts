import { UserProfileRelation } from '../schemas';
import { AbstractUserProfileRelationsDao } from './abstract-user-profile-relations.dao';
import { Dao } from '@/core';

@Dao(UserProfileRelation)
export class UserProfileRelationsDao extends AbstractUserProfileRelationsDao {}
