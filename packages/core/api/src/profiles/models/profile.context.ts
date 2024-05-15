import { Membership, Organization, Profile, UserProfileRelation } from '../schemas';
import { IOptionalUserContext, IUserContext, User } from '@/users';
import { useUserProfileRelationHelper } from '../helpers';
import { BaseModel, type BaseModelData, PropertyType } from '@lyvely/common';
import {
  BaseUserProfileRelationType,
  getProfileRelationRole,
  IPermissionSetting,
  IProfilePermissionData,
  IProfilePermissionObject,
  ProfileMembershipRole,
  ProfileRelationRole,
  UserStatus,
} from '@lyvely/interface';
import { IUserWithProfileRelation } from '../interfaces/user-with-profile-relation.interface';

export type ProfileContextData<T extends ProfileContext = ProfileContext> = BaseModelData<
  Omit<T, 'oid' | 'pid' | 'organization'>
> & { organizationContext?: ProfileContext<Organization> };

/**
 * This composite class holds information about the relation between a user and a profile and provides some utility
 * access functions. This class is mainly used in the controller and service layer for access and permission checks.
 *
 * @template T - The type of the profile.
 */
export class ProfileContext<TProfile extends Profile = Profile>
  implements IOptionalUserContext, IProfilePermissionObject
{
  /**
   * Represents the user of the context.
   * If no user is given, this represents a profile context for visitor access.
   */
  user?: User;

  /**
   * The profile of this context.
   */
  profile: TProfile;

  /**
   * Represents the context of the organization related to the profile (if any).
   */
  organizationContext?: ProfileContext<Organization>;

  /**
   * The relations between the user and the profile of this context.
   */
  @PropertyType([UserProfileRelation])
  relations: UserProfileRelation[];

  constructor(data: ProfileContextData<ProfileContext<TProfile>>) {
    BaseModel.init(this, data);
    if (!this.organizationContext && this.profile instanceof Organization) {
      this.organizationContext = this as ProfileContext<Organization>;
    }
  }

  /**
   * Retrieves the organization id of the profile.
   * Note, every profile has an organization id, even if the organization does not exist.
   */
  get oid() {
    return this.profile.oid;
  }

  /**
   * Retrieves the profile id of this context.
   */
  get pid() {
    return this.profile._id;
  }

  /**
   * Retrieves the organization profile related to this profile or the profile itself if the profile is an organization.
   */
  get organization() {
    return this.getOrganizationContext()?.profile;
  }

  /**
   * Retrieves the organization context related to this profile or this if the profile is an organization.
   *
   * @return {ProfileContext<Organization> | null} The organization context if the profile is of type Organization, otherwise returns null.
   */
  getOrganizationContext(): ProfileContext<Organization> | null {
    if (this.profile instanceof Organization) {
      return this as ProfileContext<Organization>;
    }

    return this.organizationContext || null;
  }

  /**
   * Sets the organization context.
   *
   * @param {ProfileContext<Organization>} context - The organization context to set.
   *
   * @return {void}
   */
  setOrganizationContext(context: ProfileContext<Organization>) {
    this.organizationContext = context;
  }

  /**
   * Checks if this context is related to an authenticated user.
   *
   * @returns {boolean} - Whether this context is related to an authenticated user.
   */
  isUser(): boolean {
    return !!this.user;
  }

  /**
   * Checks if this context is related to an unauthenticated visitor.
   *
   * @returns {boolean} Whether this context is related to an unauthenticated visitor.
   */
  isVisitor(): boolean {
    return !this.user;
  }

  /**
   * Checks if the user of this context is a member of the profile.
   *
   * @return {boolean} Whether the user of this context is a member of the profile.
   */
  isProfileMember(): boolean {
    return !!this.getMembership();
  }

  /**
   * Checks if the user of this context is a member of the profile.
   *
   * @return {boolean} Whether the user of this context is a member of the profile.
   */
  isActiveProfileMember(...roles: ProfileMembershipRole[]): boolean {
    return (
      this.isProfileMember() &&
      this.user!.status === UserStatus.Active &&
      this.getMembership(...roles)?.relationStatus === UserStatus.Active
    );
  }

  /**
   * Checks if the user is the owner of the profile.
   *
   * @returns {boolean} - Returns true if the user is the owner of the profile, otherwise false.
   */
  isProfileOwner(): boolean {
    return !!this.getMembership(ProfileMembershipRole.Owner);
  }

  /**
   * Checks if there is any existing relation between the user and profile.
   * @returns {boolean} - True if there is any existing relation between the user and profile, false otherwise.
   */
  hasRelation() {
    return !!this.relations.length;
  }

  /**
   * Retrieves the profile relation role of the user in this profile context.
   *
   * @returns {ProfileRelationRole} The role of the user in the this profile context.
   */
  getRole(): ProfileRelationRole {
    return getProfileRelationRole(
      this.user,
      this.relations,
      this.getOrganizationContext()?.relations,
    );
  }

  /**
   * Retrieves the membership for the specified roles.
   *
   * @param {...ProfileMembershipRole[]} roles - The roles to retrieve the membership for.
   * @returns {Membership | undefined} - The membership object if found, or undefined if not found.
   */
  getMembership(...roles: ProfileMembershipRole[]): Membership | undefined {
    const membership = useUserProfileRelationHelper(this.relations).getMembership(...roles);
    if (membership) return new Membership(membership);
  }

  /**
   * Removes user relations of a given type from the profile.
   *
   * @param {BaseUserProfileRelationType} type - The type of relations to be removed.
   */
  removeRelationsByType(type: BaseUserProfileRelationType) {
    this.relations = useUserProfileRelationHelper(this.relations).removeRelationsByType(type);
  }

  /**
   * Retrieves the permission settings for the current profile.
   *
   * @returns {IPermissionSetting[]} An array of permission settings.
   */
  getPermissionSettings(): IPermissionSetting[] {
    return this.profile.getPermissionSettings();
  }

  /**
   * Retrieves the permission groups associated with the profile.
   *
   * @return {string[]} An array of strings representing the permission groups.
   */
  getPermissionGroups(): string[] {
    return this.profile.getPermissionGroups();
  }

  /**
   * Retrieves the profile visibility level.
   *
   * @returns {ProfileVisibilityLevel} The profile visibility level.
   */
  getProfilePermissionData(): IProfilePermissionData {
    return this.profile;
  }
}

/**
 * Represents a profile context for authenticated users, which means it does not support visitors.
 */
export class ProtectedProfileContext<T extends Profile = Profile>
  extends ProfileContext<T>
  implements IUserContext, IUserWithProfileRelation
{
  override user: User;

  constructor(data: ProfileContextData<ProtectedProfileContext<T>>) {
    super(false);
    BaseModel.init(this, data);
  }
}

/**
 * Represents a profile context for member users. This can be used on endpoints with a membership guard.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export interface ProfileMembershipContext<T extends Profile = Profile>
  extends ProtectedProfileContext<T> {
  getMembership(): Membership;
  getMembership(...roles: ProfileMembershipRole[]): Membership | undefined;
}
