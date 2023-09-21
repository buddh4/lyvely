import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Request,
  UseInterceptors,
} from '@nestjs/common';

import { ProfilesService } from '../services';
import { UserRequest } from '@lyvely/users';
import {
  ProfileRelationInfos,
  ENDPOINT_PROFILE_RELATION_INFOS,
  ProfileRelationInfosEndpoint,
} from '@lyvely/profiles-interface';
import { mapType } from '@lyvely/core';
import { ProfileContext } from '../models';

@Controller(ENDPOINT_PROFILE_RELATION_INFOS)
@UseInterceptors(ClassSerializerInterceptor)
export class ProfileRelationInfosController implements ProfileRelationInfosEndpoint {
  constructor(private profilesService: ProfilesService) {}

  @Get()
  async getUserProfileInfos(@Request() req: UserRequest): Promise<ProfileRelationInfos> {
    const relations = await this.profilesService.findProfileRelationsByUser(req.user);
    return mapType([ProfileContext], ProfileRelationInfos, relations);
  }
}
