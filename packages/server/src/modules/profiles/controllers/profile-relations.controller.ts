import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Request,
  UseInterceptors,
} from '@nestjs/common';

import { ProfilesService } from '../services';
import { UserRequest } from "../../../core/types";
import { ProfileRelationInfos } from "@lyvely/common";
import { mapType } from "@lyvely/common";
import { UserWithProfileAndRelations } from "../models";

@Controller('profile-relations')
@UseInterceptors(ClassSerializerInterceptor)
export class ProfileRelationsController {

  constructor(private profilesService: ProfilesService) {}

  @Get()
  async getUserProfileInfos(@Request() req: UserRequest): Promise<ProfileRelationInfos> {
    const relations = await this.profilesService.findProfileRelationsByUser(req.user);
    return mapType([UserWithProfileAndRelations], ProfileRelationInfos, relations);
  }
}
