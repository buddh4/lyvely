import { UserProfileRelation, Membership } from '../schemas';
import { useRelationHelper } from '@lyvely/core-interface';

export const useUserProfileRelationHelper = (relations: UserProfileRelation[]) =>
  useRelationHelper<UserProfileRelation, Membership>(relations);
