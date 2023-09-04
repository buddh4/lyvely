import { Body, Controller, Get, NotFoundException, Param, Post, Request } from '@nestjs/common';
import {
  ProfileWithRelationsModel,
  CreateProfileDto,
  ProfileType,
  mapType,
  ProfilesEndpoint,
  ENDPOINT_PROFILES,
} from '@lyvely/common';
import { ProfilesService } from '../services';
import { ProfileContext, ProfileRelations } from '../models';
import { UseClassSerializer } from '@lyvely/core';
import { User, UserRequest } from '@lyvely/users';

@Controller(ENDPOINT_PROFILES)
@UseClassSerializer()
export class ProfilesController implements ProfilesEndpoint {
  constructor(private profilesService: ProfilesService) {}

  @Get(':id')
  async getProfile(
    @Param('id') pid: string,
    @Request() req: UserRequest,
  ): Promise<ProfileWithRelationsModel> {
    const { user } = req;
    if (pid === 'default') {
      return this.getDefaultProfile(req.user);
    }

    const profileRelations = await this.profilesService.findProfileRelations(user, pid);

    // TODO: (profile visibility) currently only member profiles are supported
    if (!profileRelations.userRelations.length) throw new NotFoundException();

    return mapType(ProfileRelations, ProfileWithRelationsModel, profileRelations);
  }

  private async getDefaultProfile(user: User) {
    const profileRelations = await this.profilesService.findDefaultProfileMembershipByUser(user);
    return mapType(ProfileContext, ProfileWithRelationsModel, profileRelations);
  }

  @Post()
  async create(@Body() dto: CreateProfileDto, @Request() req): Promise<ProfileWithRelationsModel> {
    // TODO: (TEAM) check if user is allowed to create team profiles
    let profileRelations;
    if (dto.type === ProfileType.User) {
      profileRelations = await this.profilesService.createUserProfile(req.user, dto);
    } else if (dto.type === ProfileType.Group) {
      profileRelations = await this.profilesService.createGroupProfile(req.user, dto);
    } else if (dto.type === ProfileType.Organization) {
      profileRelations = await this.profilesService.createOrganization(req.user, dto);
    }

    return mapType(ProfileContext, ProfileWithRelationsModel, profileRelations);
  }
}
