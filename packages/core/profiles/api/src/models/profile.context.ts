import { UserProfileRelation, Profile, Membership, Organization } from '../schemas';
import { User, IOptionalUserContext, IUserContext } from '@lyvely/users';
import { BaseModel, PropertyType } from '@lyvely/common';
import { BaseProfileRelationRole, BaseUserProfileRelationType } from '@lyvely/profiles-interface';

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

  isMember(): boolean {
    return !!this.getMembership();
  }

  isOwner(): boolean {
    return !!this.getRelationByRole(BaseProfileRelationRole.Owner);
  }

  hasRelation() {
    return !!this.relations.length;
  }

  getRole() {
    const membership = this.getMembership();
    if (membership) return membership.role;
    const organizationMembership = this.getOrganizationContext()?.getMembership();
    if (organizationMembership) return BaseProfileRelationRole.Organization;
    if (this.isUser()) return BaseProfileRelationRole.User;
    return BaseProfileRelationRole.Visitor;
  }

  getMembership(): Membership | undefined {
    const membership = this.getRelationOfType(BaseUserProfileRelationType.Membership);
    return membership ? new Membership(membership) : undefined;
  }

  getRelationOfType(type: string): UserProfileRelation | undefined {
    const relations = this.getAllRelationsOfType(type);
    return relations.length ? relations[0] : undefined;
  }

  getRelationByRole(role: string): UserProfileRelation | undefined {
    const relations = this.relations.filter((r) => r.role === role);
    return relations.length ? relations[0] : undefined;
  }

  getAllRelationsOfType(type: string): UserProfileRelation[] {
    return this.relations.filter((r) => r.type === type);
  }
}

export class ProfileUserContext<T extends Profile = Profile>
  extends ProfileContext<T>
  implements IUserContext
{
  user: User;
}
