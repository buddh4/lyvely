import { UserProfileRelation, Membership } from '../schemas';
import { useRelationHelper } from '@lyvely/interface';

export const useUserProfileRelationHelper = (relations: UserProfileRelation[]) =>
  useRelationHelper<UserProfileRelation, Membership>(relations);
