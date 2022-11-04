import { Injectable } from '@nestjs/common';
import { Membership, ProfileRelationUserInfo } from '../schemas';
import { MembershipsDao } from '../daos';

@Injectable()
export class ProfileMembershipService {
  constructor(private readonly membershipDao: MembershipsDao) {}

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
