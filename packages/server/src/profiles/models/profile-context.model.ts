import {
  UserProfileRelation,
  Profile,
  Membership,
  Organization,
} from '../schemas';
import { User } from '@/users';
import {
  BaseModel,
  PropertyType,
  BaseUserProfileRelationType,
} from '@lyvely/common';

/**
 * This composite class holds information about the relation between a user and a profile and provides some utility
 * access functions. This class is mainly used in the controller and service layer for access and permission checks.
 */
export class OptionalProfileContext<
  T extends Profile = Profile,
> extends BaseModel<OptionalProfileContext> {
  user?: User;
  profile?: T;

  // TODO: Implement
  protected organizationContext?: OptionalProfileContext<Organization>;

  @PropertyType([UserProfileRelation])
  relations?: UserProfileRelation[];

  get oid() {
    return this.profile.oid;
  }

  get pid() {
    return this.profile._id;
  }

  get organization() {
    return this.getOrganizationContext()?.profile;
  }

  getOrganizationContext(): OptionalProfileContext<Organization> {
    if (this.profile instanceof Organization) {
      return this;
    }

    return this.organizationContext;
  }

  isGuest(): boolean {
    return !this.user;
  }

  isMember(): boolean {
    return !!this.getMembership();
  }

  hasRelation() {
    return !!this.relations.length;
  }

  getMembership(): Membership | undefined {
    const membership = this.getRelationOfType(
      BaseUserProfileRelationType.Membership,
    );
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

export class ProfileContext<
  T extends Profile = Profile,
> extends OptionalProfileContext<T> {
  user: User;
  profile: T;
  @PropertyType([UserProfileRelation])
  relations: UserProfileRelation[];
  protected organizationContext?: ProfileContext<Organization>;
}
