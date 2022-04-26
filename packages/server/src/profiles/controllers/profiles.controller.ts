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
import { ProfileDto, ProfileMembershipDto, MembershipDto , CategoryDto, CreateProfileDto } from 'lyvely-common';

import { ProfilesService } from '../services/profiles.service';

@Controller('profiles')
@UseInterceptors(ClassSerializerInterceptor)
export class ProfilesController {

  constructor(private profilesService: ProfilesService) {}

  @Get(':id')
  async getProfile(@Request() req, @Param('id') id: string): Promise<ProfileMembershipDto> {
    const { profile, membership } = ((id === 'default')
    ? await this.profilesService.findDefaultProfileMembershipByUser(req.user)
    : await this.profilesService.findProfileMembershipByUserAndId(req.user, id)) || {};

    // TODO: currently only member profiles are supported

    if(!profile || !membership) {
      throw new NotFoundException();
    }

    return new ProfileMembershipDto({
      membership: new MembershipDto(membership),
      profile: new ProfileDto(profile)
    });
  }

  @Post()
  async create(@Request() req, @Body() dto: CreateProfileDto): Promise<ProfileDto> {
    // TODO: (TEAM) check if user is allowed to create team profiles
    const { profile } = await this.profilesService.createProfile(req.user, { name: dto.name, type: dto.type });
    return new ProfileDto(profile);
  }

  @Get(':profile/categories')
  async getCategories(@Request() req, @Param('profile') pid: string): Promise<CategoryDto[]> {
    return;
    /*const membership = await this.findProfileMembershipByUserAndId(req.user, pid);
    if (!membership) {
      throw new NotFoundException();
    }

    return membership.profile.categories.map((category) => new CategoryDto(category));*/
  }
}
