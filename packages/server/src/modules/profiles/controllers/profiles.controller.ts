import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param, Post,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileWithRelationsDto, CreateProfileDto, ProfileType, mapType } from "@lyvely/common";
import { ProfilesService } from '../services';
import { UserWithProfileAndRelations } from "../models";
import { ProfilesEndpoint, ENDPOINT_PROFILES } from "@lyvely/common";

@Controller(ENDPOINT_PROFILES)
@UseInterceptors(ClassSerializerInterceptor)
export class ProfilesController implements ProfilesEndpoint  {

  constructor(private profilesService: ProfilesService) {}

  @Get(':id')
  async getProfile(@Param('id') id: string, @Request() req): Promise<ProfileWithRelationsDto> {
    const profileRelations = ((id === 'default')
      ? await this.profilesService.findDefaultProfileMembershipByUser(req.user)
      : await this.profilesService.findUserProfileRelations(req.user, id));

    // TODO: (profile visibility) currently only member profiles are supported
    if(!profileRelations.getMembership()) {
      throw new NotFoundException();
    }

    return mapType(UserWithProfileAndRelations, ProfileWithRelationsDto, profileRelations);
  }

  @Post()
  async create(@Body() dto: CreateProfileDto, @Request() req): Promise<ProfileWithRelationsDto> {
    // TODO: (TEAM) check if user is allowed to create team profiles
    let profileRelations;
    if(dto.type === ProfileType.User) {
      profileRelations = await this.profilesService.createUserProfile(req.user, dto);
    } else if(dto.type === ProfileType.Group) {
      profileRelations = await this.profilesService.createGroupProfile(req.user, dto)
    } else if(dto.type === ProfileType.Organization) {
      profileRelations = await this.profilesService.createOrganization(req.user, dto)
    }

    return mapType(UserWithProfileAndRelations, ProfileWithRelationsDto, profileRelations);
  }
}
