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
import { ProfileMembershipDto, MembershipDto , TagDto, CreateProfileDto, UserToProfileRelationDto } from "@lyvely/common";
import { ProfilesService } from '../services';
import { ProfileRequest } from "../../../core/types";
import { ProfileRelationDto } from "@lyvely/common";

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

    const relations = await this.profilesService.findAllUserProfileRelations(profile);

    return new ProfileMembershipDto({
      ...profile,
      membership: new MembershipDto(membership),
      relations: relations.map(relation => new ProfileRelationDto(relation))
    });
  }

  @Post()
  async create(@Request() req, @Body() dto: CreateProfileDto): Promise<UserToProfileRelationDto> {
    // TODO: (TEAM) check if user is allowed to create team profiles
    const profileRelations = await this.profilesService.createProfile(req.user, { name: dto.name, type: dto.type });
    return UserToProfileRelationDto.create(profileRelations.profile, profileRelations.getMembership());
  }

  @Get(':cid/tags')
  async getCategories(@Request() req: ProfileRequest): Promise<TagDto[]> {
    const { profile } = req;
    return profile.tags.map((category) => new TagDto(category));
  }
}
