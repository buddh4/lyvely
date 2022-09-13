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
import { ProfileMembershipDto, MembershipDto , TagModel, CreateProfileDto, UserToProfileRelationDto } from "@lyvely/common";
import { ProfilesService } from '../services';
import { ProfileRequest } from "../../../core/types";
import { ProfileRelationDto } from "@lyvely/common";
import { ProfileType } from "@lyvely/common";

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
    let profileRelation;
    if(dto.type === ProfileType.User) {
      profileRelation = await this.profilesService.createUserProfile(req.user, dto);
    } else if(dto.type === ProfileType.Group) {
      profileRelation = await this.profilesService.createGroupProfile(req.user, dto)
    } else if(dto.type === ProfileType.Organization) {
      profileRelation = await this.profilesService.createOrganization(req.user, dto)
    }

    return UserToProfileRelationDto.create(profileRelation.profile, profileRelation.getMembership());
  }

  @Get(':cid/tags')
  async getCategories(@Request() req: ProfileRequest): Promise<TagModel[]> {
    const { profile } = req;
    return profile.tags.map((category) => new TagModel(category));
  }
}
