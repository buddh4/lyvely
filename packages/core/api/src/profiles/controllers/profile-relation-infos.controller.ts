import { ClassSerializerInterceptor, Get, Param, Request, UseInterceptors } from '@nestjs/common';

import { ProfilesService } from '../services';
import { UserRequest, UsersService } from '@/users';
import {
  ProfileRelationInfos,
  API_PROFILE_RELATION_INFOS,
  ProfileRelationInfosEndpoint,
  ProfileRelationUserInfoModel,
  ProfileRelationInfosEndpoints,
  DocumentNotFoundException,
} from '@lyvely/interface';
import { mapType } from '@lyvely/common';
import { ProtectedProfileContext } from '../models';
import { Controller } from '@/core';

@Controller(API_PROFILE_RELATION_INFOS)
@UseInterceptors(ClassSerializerInterceptor)
export class ProfileRelationInfosController implements ProfileRelationInfosEndpoint {
  constructor(private profilesService: ProfilesService, private usersService: UsersService) {}

  @Get()
  async getAllProfileRelationInfos(@Request() req: UserRequest): Promise<ProfileRelationInfos> {
    const relations = await this.profilesService.findAllProfileContextsByUser(req.user);
    return mapType([ProtectedProfileContext], ProfileRelationInfos, relations);
  }

  @Get(ProfileRelationInfosEndpoints.PROFILE_RELATION_INFO(':pid', ':uid'))
  async getProfileRelationUserInfo(
    @Param('pid') pid,
    @Param('uid') uid,
  ): Promise<ProfileRelationUserInfoModel> {
    const user = await this.usersService.findUserById(uid);

    if (!user) throw new DocumentNotFoundException();

    const context = await this.profilesService.findProfileContext(user, pid);
    const membership = context.getMembership();
    return membership
      ? new ProfileRelationUserInfoModel(membership.userInfo)
      : { displayName: user.getDisplayName(), guid: user.guid };
  }
}
