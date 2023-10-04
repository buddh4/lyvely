import { Body, Controller, Get, NotFoundException, Param, Post, Request } from '@nestjs/common';
import { UseClassSerializer } from '@lyvely/core';
import { mapType } from '@lyvely/common';
import {
  ProfileWithRelationsModel,
  CreateProfileModel,
  ProfileType,
  ProfilesEndpoint,
  ENDPOINT_PROFILES,
} from '@lyvely/profiles-interface';
import { ProfilesService } from '../services';
import { ProfileUserContext, ProfileRelations } from '../models';
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

  private async getDefaultProfile(user: User): Promise<ProfileWithRelationsModel> {
    const profileRelations = await this.profilesService.findDefaultProfileMembershipByUser(user);
    return mapType(ProfileUserContext, ProfileWithRelationsModel, profileRelations);
  }

  @Post()
  async create(
    @Body() dto: CreateProfileModel,
    @Request() req,
  ): Promise<ProfileWithRelationsModel> {
    // TODO: (TEAM) check if user is allowed to create team profiles
    let profileRelations;
    if (dto.type === ProfileType.User) {
      profileRelations = await this.profilesService.createUserProfile(req.user, dto);
    } else if (dto.type === ProfileType.Group) {
      profileRelations = await this.profilesService.createGroupProfile(req.user, dto);
    } else if (dto.type === ProfileType.Organization) {
      profileRelations = await this.profilesService.createOrganization(req.user, dto);
    }

    return mapType(ProfileUserContext, ProfileWithRelationsModel, profileRelations);
  }
}
