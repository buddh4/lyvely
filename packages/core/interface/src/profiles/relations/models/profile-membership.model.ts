import { Exclude, Expose } from 'class-transformer';
import { IMembership, ProfileMembershipRole, BaseUserProfileRelationType } from '../interfaces';
import { ProfileRelationModel } from './profile-relation.model';
import { TransformObjectIds } from '@lyvely/common';

/**
 * Represents a membership profile relation model.
 *
 * @tparam {TID} - The type of the membership identifier.
 */
@Exclude()
export class MembershipModel<TID = string>
  extends ProfileRelationModel<TID, MembershipModel<TID>>
  implements IMembership<TID>
{
  @Expose()
  role: ProfileMembershipRole;

  @Expose()
  @TransformObjectIds()
  groups: TID[];
}

/**
 * Checks if a given relation is a membership relation.
 *
 * @param {ProfileRelationModel} relation - The relation to be checked.
 *
 * @return {boolean} - Returns true if the relation is a membership relation, false otherwise.
 */
export function isMembershipRelation(
  relation: ProfileRelationModel<any, any>,
): relation is MembershipModel {
  return relation?.type === BaseUserProfileRelationType.Membership;
}
