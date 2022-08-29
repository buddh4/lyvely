import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Request,
  UseInterceptors,
} from '@nestjs/common';

import { ProfilesService } from '../services';
import { UserRequest } from "../../core/types";
import { UserToProfileRelationDto } from "@lyvely/common";

@Controller('profile-relations')
@UseInterceptors(ClassSerializerInterceptor)
export class ProfileRelationsController {

  constructor(private profilesService: ProfilesService) {}

  @Get()
  async getUserProfileInfos(@Request() req: UserRequest): Promise<UserToProfileRelationDto[]> {
    // TODO (performance) We maybe should embed short profile info into profile-relations to skip profile query
    const relations = await this.profilesService.findProfileRelationsByUser(req.user);

    return relations.map(relation => new UserToProfileRelationDto({
      ...relation.profile,
      relationType: relation.relation.type,
      role: relation.relation.role,
    }))
  }
}
