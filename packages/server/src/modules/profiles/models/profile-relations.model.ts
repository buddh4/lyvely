import { UserProfileRelation, Profile, Membership } from '../schemas';
import { User } from '../../users';
import { BaseModel, PropertyType, BaseUserProfileRelationType } from "@lyvely/common";

/**
 * This composite class holds information about the relation between a user and a profile and provides some utility
 * access functions. This class is mainly used in the controller and service layer for access and permission checks.
 */
export class UserWithProfileAndRelations extends BaseModel<UserWithProfileAndRelations>{
  user?: User;
  profile: Profile;

  @PropertyType([UserProfileRelation])
  relations: UserProfileRelation[];

  get oid() {
    return this.profile.oid;
  }

  get pid() {
    return this.profile._id;
  }

  isGuest(): boolean {
    return !!!this.user;
  }

  isMember(): boolean {
    return !!this.getMembership();
  }

  hasRelation() {
    return !!this.relations.length;
  }

  getMembership(): Membership | undefined {
    const membership = this.getRelationOfType(BaseUserProfileRelationType.Membership);
    return membership ? new Membership(membership) : undefined;
  }

  getRelationOfType(type: string): UserProfileRelation|undefined {
    const relations = this.getAllRelationsOfType(type);
    return relations.length ? relations[0] : undefined;
  }

  getRelationByRole(role: string): UserProfileRelation|undefined {
    const relations = this.relations.filter(r => r.role === role);
    return relations.length ? relations[0] : undefined;
  }

  getAllRelationsOfType(type: string): UserProfileRelation[] {
    return this.relations.filter(r => r.type === type);
  }
}
