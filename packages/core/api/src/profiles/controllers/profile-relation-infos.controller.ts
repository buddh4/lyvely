import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Request,
  UseInterceptors,
} from '@nestjs/common';

import { ProfilesService } from '../services';
import { UserRequest } from '@/users';
import {
  ProfileRelationInfos,
  ENDPOINT_PROFILE_RELATION_INFOS,
  ProfileRelationInfosEndpoint,
} from '@lyvely/core-interface';
import { mapType } from '@lyvely/common';
import { ProtectedProfileContext } from '../models';

@Controller(ENDPOINT_PROFILE_RELATION_INFOS)
@UseInterceptors(ClassSerializerInterceptor)
export class ProfileRelationInfosController implements ProfileRelationInfosEndpoint {
  constructor(private profilesService: ProfilesService) {}

  @Get()
  async getUserProfileInfos(@Request() req: UserRequest): Promise<ProfileRelationInfos> {
    const relations = await this.profilesService.findAllProfileContextsByUser(req.user);
    return mapType([ProtectedProfileContext], ProfileRelationInfos, relations);
  }
}
