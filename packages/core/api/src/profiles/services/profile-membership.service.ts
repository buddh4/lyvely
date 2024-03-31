import { Injectable } from '@nestjs/common';
import { Membership, Profile, ProfileRelationUserInfo } from '../schemas';
import { MembershipsDao } from '../daos';
import { DocumentIdentity, Transaction } from '@/core';
import { User, UsersService } from '@/users';
import {
  BaseUserProfileRelationType,
  ForbiddenServiceException,
  IntegrityException,
  ProfileMembershipRole,
  ProfileType,
} from '@lyvely/interface';
import fs from 'fs/promises';
import { Avatar } from '../../avatars';
import crypto from 'crypto';
import client from 'https';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { getLocalUploadFilePath } from '@/files';
import type { ProfileMembershipContext } from '../models';
import { ConfigService } from '@nestjs/config';
import type { ServerConfiguration } from '@/config';

@Injectable()
export class ProfileMembershipService {
  constructor(
    private readonly membershipDao: MembershipsDao,
    private usersService: UsersService,
    private configService: ConfigService<ServerConfiguration>,
  ) {}

  /**
   * Retrieves the memberships associated with a given profile.
   *
   * @param {DocumentIdentity<Profile>} profile - The profile document identity.
   * @return {Promise<Array<Membership>>} - A promise that resolves to an array of Membership objects.
   */
  async getMemberShips(profile: DocumentIdentity<Profile>) {
    return this.membershipDao.findAllByProfile(profile);
  }

  /**
   * Revoke the membership of a profile and removes the membership relation from the given context.
   *
   * @param {ProfileMembershipContext} context - The context containing the profile membership to be revoked.
   *
   * @return {Promise<void>} - A promise that resolves when the membership is revoked.
   */
  async revoke(context: ProfileMembershipContext) {
    await this.canRevokeMembershipOrThrow(context);
    // TODO: Live update for other users
    await this.membershipDao.deleteById(context.getMembership());
    context.removeRelationsByType(BaseUserProfileRelationType.Membership);
  }

  /**
   * Determines whether the membership can be revoked or throws an exception.
   *
   * @param {ProfileMembershipContext} context - The context object containing the membership details.
   * @throws {IntegrityException} - Throws an exception if the membership is the only owner membership.
   * @private
   */
  private async canRevokeMembershipOrThrow(context: ProfileMembershipContext) {
    if (!context.isProfileOwner()) return;

    const owners = await this.membershipDao.findByRole(
      context.profile,
      ProfileMembershipRole.Owner,
    );

    if (owners.length === 1) {
      throw new IntegrityException('Can not delete only owner membership.');
    }
  }

  /**
   * Updates the profile membership information of a user.
   *
   * @param {Membership} membership - The membership object to update.
   * @param {Object} info - The updated display name and description.
   * @param {string} info.displayName - The updated display name.
   * @param {string} info.description - The updated description.
   *
   * @return {Promise} - Resolves to the updated membership info object.
   */
  async updateMembershipInfo(
    membership: Membership,
    { displayName, description }: Pick<ProfileRelationUserInfo, 'displayName' | 'description'>,
  ) {
    return await this.membershipDao.updateOneSetById(membership, {
      'userInfo.displayName': displayName,
      'userInfo.description': description,
    });
  }

  /**
   * Creates a membership association between a profile and a user.
   * If the profile is a user profile, it does only accept one membership
   * If a membership already exists, it updates the role if it's different.
   * Otherwise, it creates a new membership and increments the profile count for the user.
   * @param profile The profile for which the membership is being created.
   * @param member The user who is becoming a member.
   * @param role The role of the user in the membership. Defaults to 'Member'.
   * @param transaction An optional transaction context for database operations.
   * @returns A Promise resolving to the created or updated membership.
   */
  async createMembership(
    profile: Profile,
    member: User,
    role: ProfileMembershipRole = ProfileMembershipRole.Member,
    transaction?: Transaction,
  ): Promise<Membership> {
    const existingMembership = await this.membershipDao.findByProfileAndUser(
      profile,
      member,
      transaction,
    );

    if (
      profile.isOfType(ProfileType.User) &&
      (existingMembership || role !== ProfileMembershipRole.Owner)
    ) {
      throw new ForbiddenServiceException(
        'Can not create additional or non owner membership for user profile',
      );
    }

    if (existingMembership) {
      if (existingMembership.role !== role) {
        await this.membershipDao.updateOneSetById(existingMembership, { role }, transaction);
      }
      return existingMembership;
    }

    const [membership] = await Promise.all([
      this.membershipDao.addMembership(profile, member, role, transaction),
      this.usersService.incrementProfileCount(member, profile.type, transaction),
    ]);

    return membership;
  }

  /**
   * Updates the avatar of a profile membership.
   *
   * @param {ProfileMembershipContext} context - The context of the user profile membership.
   * @param {Express.Multer.File} file - The file containing the new avatar image.
   * @returns {Avatar} - The updated avatar object.
   */
  async updateAvatar(context: ProfileMembershipContext, file: Express.Multer.File) {
    const avatar = new Avatar();
    const oldGuid = context.getMembership().userInfo.guid;
    await fs.writeFile(this.getAvatarFilePath(avatar.guid), file.buffer);
    await this.updateUserInfoAvatar(context, avatar);
    this.deleteOldAvatar(oldGuid);
    return avatar;
  }

  /**
   * Updates the Avatar of a profile membership with his Gravatar.
   *
   * @param {ProfileMembershipContext} context - The context object containing user information.
   * @return {Promise<Avatar>} A promise that resolves with the updated avatar.
   */
  async updateGravatar(context: ProfileMembershipContext): Promise<Avatar> {
    // TODO: Gravatar should only be allowed for verified emails (at the moment the default email is verified)
    const { user } = context;
    const avatar = new Avatar();
    const oldGuid = context.getMembership().userInfo.guid;
    const email = context.getMembership().userInfo.email || user.email;
    const gravatarUrl = this.buildGravatarUrl(email);

    return new Promise((resolve, reject) => {
      client.get(gravatarUrl, (res) => {
        const stream = createWriteStream(this.getAvatarFilePath(avatar.guid));
        res.pipe(stream);
        stream.on('error', reject);
        stream.on('finish', async () => {
          await this.updateUserInfoAvatar(context, avatar);
          this.deleteOldAvatar(oldGuid);
          resolve(avatar);
        });
      });
    });
  }

  /**
   * Deletes the old avatar file associated with the given GUID.
   *
   * @param {string} guid - The GUID of the avatar to delete.
   * @private
   * @return {Promise<void>} - A promise that resolves when the avatar file is deleted.
   */
  private async deleteOldAvatar(guid: string): Promise<void> {
    const avatarFilePath = this.getAvatarFilePath(guid);
    if (existsSync(avatarFilePath)) {
      await fs.unlink(avatarFilePath);
    }
  }

  /**
   * Builds a Gravatar URL based on the given email.
   *
   * @param {string} email - The email address to generate a Gravatar URL for.
   * @private
   * @return {string} The Gravatar URL.
   */
  private buildGravatarUrl(email: string) {
    const hash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
    return `https://s.gravatar.com/avatar/${hash}?s=64`;
  }

  /**
   * Updates the avatar of the user's profile.
   *
   * @param {ProfileMembershipContext} context - The membership context of the user's profile.
   * @param {Avatar} avatar - The new avatar to update.
   * @private
   * @returns {Promise<void>} - A promise that resolves when the avatar update is complete.
   */
  private async updateUserInfoAvatar(context: ProfileMembershipContext, avatar: Avatar) {
    return this.membershipDao.updateOneSetById(context.getMembership(), {
      'userInfo.guid': avatar.guid,
    });
  }

  /**
   * Retrieves the file path for the avatar with the given GUID.
   *
   * @param {string} guid - The GUID of the avatar.
   * @private
   * @returns {string} The file path for the avatar.
   */
  private getAvatarFilePath(guid: string) {
    const avatarDirPath = getLocalUploadFilePath(this.configService, 'avatars');
    if (!existsSync(avatarDirPath)) {
      mkdirSync(avatarDirPath, { recursive: true });
    }

    return getLocalUploadFilePath(this.configService, 'avatars', guid);
  }
}
