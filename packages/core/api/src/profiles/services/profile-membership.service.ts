import { Injectable } from '@nestjs/common';
import { Membership, Profile, ProfileRelationUserInfo } from '../schemas';
import { MembershipsDao } from '../daos';
import { DocumentIdentity, Transaction } from '@/core';
import { User, UsersService } from '@/users';
import { ProfileMembershipRole, ProfileType, ForbiddenServiceException } from '@lyvely/interface';
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

  async getMemberShips(profile: DocumentIdentity<Profile>) {
    return this.membershipDao.findAllByProfile(profile);
  }

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

  async updateAvatar(context: ProfileMembershipContext, file: Express.Multer.File) {
    const avatar = new Avatar();
    const oldGuid = context.getMembership().userInfo.guid;
    await fs.writeFile(this.getAvatarFilePath(avatar.guid), file.buffer);
    await this.updateUserInfoAvatar(context, avatar);
    this.deleteOldAvatar(oldGuid);
    return avatar;
  }

  async updateGravatar(context: ProfileMembershipContext): Promise<Avatar> {
    // TODO: Gravatar should only be allowed for verified emails (at the moment the default email is verified)
    const { user } = context;
    const avatar = new Avatar();
    const oldGuid = context.getMembership().userInfo.guid;
    const gravatarUrl = this.buildGravatarUrl(user);

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

  private async deleteOldAvatar(guid: string): Promise<void> {
    const avatarFilePath = this.getAvatarFilePath(guid);
    if (existsSync(avatarFilePath)) {
      await fs.unlink(avatarFilePath);
    }
  }

  private buildGravatarUrl(user: User) {
    const hash = crypto.createHash('md5').update(user.email.toLowerCase()).digest('hex');
    return `https://s.gravatar.com/avatar/${hash}?s=64`;
  }

  private async updateUserInfoAvatar(context: ProfileMembershipContext, avatar: Avatar) {
    return this.membershipDao.updateOneSetById(context.getMembership(), {
      'userInfo.guid': avatar.guid,
    });
  }

  private getAvatarFilePath(guid: string) {
    const avatarDirPath = getLocalUploadFilePath(this.configService, 'avatars');
    if (!existsSync(avatarDirPath)) {
      mkdirSync(avatarDirPath, { recursive: true });
    }

    return getLocalUploadFilePath(this.configService, 'avatars', guid);
  }
}
