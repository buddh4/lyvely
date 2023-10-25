import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Request,
  UseInterceptors,
} from '@nestjs/common';

import { ProfilesService } from '../services';
import { UserRequest, UsersService } from '@/users';
import {
  ProfileRelationInfos,
  ENDPOINT_PROFILE_RELATION_INFOS,
  ProfileRelationInfosEndpoint,
  ProfileRelationUserInfoModel,
} from '@lyvely/core-interface';
import { EntityNotFoundException, mapType } from '@lyvely/common';
import { ProtectedProfileContext } from '../models';

@Controller(ENDPOINT_PROFILE_RELATION_INFOS)
@UseInterceptors(ClassSerializerInterceptor)
export class ProfileRelationInfosController implements ProfileRelationInfosEndpoint {
  constructor(private profilesService: ProfilesService, private usersService: UsersService) {}

  @Get()
  async getAllProfileRelationInfos(@Request() req: UserRequest): Promise<ProfileRelationInfos> {
    const relations = await this.profilesService.findAllProfileContextsByUser(req.user);
    return mapType([ProtectedProfileContext], ProfileRelationInfos, relations);
  }

  @Get(':pid/:uid')
  async getProfileRelationUserInfo(
    @Param('pid') pid,
    @Param('uid') uid,
  ): Promise<ProfileRelationUserInfoModel> {
    const user = await this.usersService.findUserById(uid);

    if (!user) throw new EntityNotFoundException();

    const context = await this.profilesService.findProfileContext(user, pid);
    const membership = context.getMembership();
    return membership
      ? new ProfileRelationUserInfoModel(membership.userInfo)
      : { displayName: user.getDisplayName(), guid: user.guid };
  }
}
