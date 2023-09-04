import { Injectable } from '@nestjs/common';
import { Membership, Profile, ProfileRelationUserInfo } from '../schemas';
import { MembershipsDao } from '../daos';
import { EntityIdentity } from '@lyvely/core';
import { User } from '@lyvely/users';

@Injectable()
export class ProfileMembershipService {
  constructor(private readonly membershipDao: MembershipsDao) {}

  async getMemberShips(profile: EntityIdentity<Profile>) {
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
}
