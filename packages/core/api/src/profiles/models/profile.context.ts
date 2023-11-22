import { UserProfileRelation, Profile, Membership, Organization } from '../schemas';
import { User, IOptionalUserContext, IUserContext } from '@/users';
import { useUserProfileRelationHelper } from '../helpers';
import { BaseModel, PropertyType } from '@lyvely/common';
import {
  ProfileRelationRole,
  ProfileMembershipRole,
  getProfileRelationRole,
} from '@lyvely/interface';
import { IUserWithProfileRelation } from '../interfaces';

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
    return !!this.getMembership(ProfileMembershipRole.Owner);
  }

  hasRelation() {
    return !!this.relations.length;
  }

  getRole(): ProfileRelationRole {
    return getProfileRelationRole(
      this.user,
      this.relations,
      this.getOrganizationContext()?.relations,
    );
  }

  getMembership(...roles: ProfileMembershipRole[]): Membership | undefined {
    const membership = useUserProfileRelationHelper(this.relations).getMembership(...roles);
    if (membership) return new Membership(membership);
  }
}

export class ProtectedProfileContext<T extends Profile = Profile>
  extends ProfileContext<T>
  implements IUserContext, IUserWithProfileRelation
{
  user: User;
}
