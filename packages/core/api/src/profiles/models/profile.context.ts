import { UserProfileRelation, Profile, Membership, Organization } from '../schemas';
import { User, IOptionalUserContext, IUserContext } from '@/users';
import { BaseModel, PropertyType } from '@lyvely/common';
import {
  ProfileRelationRole,
  BaseUserProfileRelationType,
  membershipToRelationRole,
} from '@lyvely/core-interface';

/**
 * This composite class holds information about the relation between a user and a profile and provides some utility
 * access functions. This class is mainly used in the controller and service layer for access and permission checks.
 */
export class ProfileContext<T extends Profile = Profile>
  extends BaseModel<ProfileContext & { organizationContext?: ProfileContext<Organization> }>
  implements IOptionalUserContext
{
  user?: User;
  profile: T;

  protected organizationContext?: ProfileContext<Organization>;

  @PropertyType([UserProfileRelation])
  relations: UserProfileRelation[];

  get oid() {
    return this.profile.oid;
  }

  get pid() {
    return this.profile._id;
  }

  get organization() {
    return this.getOrganizationContext()?.profile;
  }

  getOrganizationContext(): ProfileContext<Organization> | null {
    if (this.profile instanceof Organization) {
      return this as ProfileContext<Organization>;
    }

    return this.organizationContext || null;
  }

  setOrganizationContext(context: ProfileContext<Organization>) {
    this.organizationContext = context;
  }

  isUser(): boolean {
    return !!this.user;
  }

  isVisitor(): boolean {
    return !this.user;
  }

  isProfileMember(): boolean {
    return !!this.getMembership();
  }

  isProfileOwner(): boolean {
    return !!this.getRelationByRole(ProfileRelationRole.Owner);
  }

  hasRelation() {
    return !!this.relations.length;
  }

  getRole(): ProfileRelationRole {
    // TODO: Currently we only respect memberships since its the only relation type at the moment.
    const membership = this.getMembership();
    if (membership) return membershipToRelationRole[membership.role];
    const organizationMembership = this.getOrganizationContext()?.getMembership();
    if (organizationMembership) return ProfileRelationRole.Organization;
    if (this.isUser()) return ProfileRelationRole.User;
    return ProfileRelationRole.Visitor;
  }

  getMembership(...roles: string[]): Membership | undefined {
    const membership = this.getRelationOfType<Membership>(BaseUserProfileRelationType.Membership);

    if (!membership) return undefined;

    const result = new Membership(membership);

    if (roles.length && !roles.includes(result.role)) return undefined;

    return result;
  }

  getRelationOfType<T extends UserProfileRelation = UserProfileRelation>(
    type: string,
  ): T | undefined {
    const relations = this.getAllRelationsOfType(type);
    return relations.length ? (relations[0] as T) : undefined;
  }

  getRelationByRole(role: string): UserProfileRelation | undefined {
    const relations = this.relations.filter((r) => r.role === role);
    return relations.length ? relations[0] : undefined;
  }

  getAllRelationsOfType(type: string): UserProfileRelation[] {
    return this.relations.filter((r) => r.type === type);
  }
}

export class ProtectedProfileContext<T extends Profile = Profile>
  extends ProfileContext<T>
  implements IUserContext
{
  user: User;
}
