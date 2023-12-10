import { MembershipModel, ProfileRelationModel } from '../models';
import {
  BaseUserProfileRelationType,
  membershipToRelationRole,
  ProfileMembershipRole,
  ProfileRelationRole,
} from '../interfaces';
import { PropertiesOf } from '@lyvely/common';
import { UserModel } from '@/users';

export function useRelationHelper<
  TRelation extends ProfileRelationModel<any> = ProfileRelationModel<any>,
  TMembership extends MembershipModel<any> = MembershipModel<any>,
>(userRelations: TRelation[]) {
  function getAllRelationsOfType<T extends TRelation = TRelation>(type: string): T[] {
    return <T[]>userRelations.filter((r) => r.type === type);
  }

  function getRelationOfType<T extends TRelation | TMembership = TRelation | TMembership>(
    type: string,
  ): T | undefined {
    return <T>getAllRelationsOfType(type)[0];
  }

  function getMembership(...roles: ProfileMembershipRole[]): TMembership | undefined {
    const membership = getRelationOfType<TMembership>(BaseUserProfileRelationType.Membership);
    return membership && (!roles.length || roles.includes(membership.role))
      ? membership
      : undefined;
  }

  return {
    getAllRelationsOfType,
    getRelationOfType,
    getMembership,
  };
}

export function getProfileRelationRole(
  user: PropertiesOf<UserModel<any>> | null | undefined,
  relations: ProfileRelationModel<any>[],
  orgRelations?: ProfileRelationModel<any>[],
) {
  const membership = useRelationHelper(relations).getMembership();

  if (membership) return membershipToRelationRole[membership.role];

  if (useRelationHelper(orgRelations || []).getMembership()) {
    return ProfileRelationRole.Organization;
  }

  return user ? ProfileRelationRole.User : ProfileRelationRole.Visitor;
}
