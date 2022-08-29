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
import { ProfileDto, ProfileMembershipDto, MembershipDto , TagDto, CreateProfileDto } from '@lyvely/common';

import { ProfilesService } from '../services';
import { ProfileRequest } from "../../core/types";

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

    return new ProfileMembershipDto({ ...profile, membership: new MembershipDto(membership) });
  }

  @Post()
  async create(@Request() req, @Body() dto: CreateProfileDto): Promise<ProfileDto> {
    // TODO: (TEAM) check if user is allowed to create team profiles
    const { profile } = await this.profilesService.createProfile(req.user, { name: dto.name, type: dto.type });
    return new ProfileDto(profile);
  }

  @Get(':cid/tags')
  async getCategories(@Request() req: ProfileRequest): Promise<TagDto[]> {
    const { profile } = req;
    return profile.tags.map((category) => new TagDto(category));
  }
}
