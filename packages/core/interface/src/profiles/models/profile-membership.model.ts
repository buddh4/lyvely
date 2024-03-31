import { Exclude, Expose } from 'class-transformer';
import { IMembership, ProfileMembershipRole, BaseUserProfileRelationType } from '../interfaces';
import { ProfileRelationModel } from './profile-relation.model';
import { BaseModel, type PropertiesOf, TransformObjectIds } from '@lyvely/common';

/**
 * Represents a membership profile relation model.
 *
 * @tparam {TID} - The type of the membership identifier.
 */
@Exclude()
export class MembershipModel<TID = string>
  extends ProfileRelationModel<TID>
  implements IMembership<TID>
{
  @Expose()
  override role: ProfileMembershipRole;

  @Expose()
  @TransformObjectIds()
  groups: TID[];

  constructor(data: PropertiesOf<MembershipModel<any>>) {
    super(false);
    BaseModel.init(this, data);
  }
}

/**
 * Checks if a given relation is a membership relation.
 *
 * @param {ProfileRelationModel} relation - The relation to be checked.
 *
 * @return {boolean} - Returns true if the relation is a membership relation, false otherwise.
 */
export function isMembershipRelation(
  relation: ProfileRelationModel<any>,
): relation is MembershipModel {
  return relation?.type === BaseUserProfileRelationType.Membership;
}
