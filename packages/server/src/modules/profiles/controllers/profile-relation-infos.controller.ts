import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Request,
  UseInterceptors,
} from '@nestjs/common';

import { ProfilesService } from '../services';
import { UserRequest } from "../../users";
import { ProfileRelationInfos } from "@lyvely/common";
import { mapType, ENDPOINT_PROFILE_RELATION_INFOS, ProfileRelationInfosEndpoint } from "@lyvely/common";
import { UserWithProfileAndRelations } from "../models";

@Controller(ENDPOINT_PROFILE_RELATION_INFOS)
@UseInterceptors(ClassSerializerInterceptor)
export class ProfileRelationInfosController implements ProfileRelationInfosEndpoint {

  constructor(private profilesService: ProfilesService) {}

  @Get()
  async getUserProfileInfos(@Request() req: UserRequest): Promise<ProfileRelationInfos> {
    const relations = await this.profilesService.findProfileRelationsByUser(req.user);
    return mapType([UserWithProfileAndRelations], ProfileRelationInfos, relations);
  }
}
