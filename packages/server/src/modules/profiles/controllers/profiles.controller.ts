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
import { ProfileWithRelationsDto , TagModel, CreateProfileDto, ProfileType, mapType } from "@lyvely/common";
import { ProfilesService } from '../services';
import { ProfileRequest } from "../../../core/types";
import { UserWithProfileAndRelations } from "../models";

@Controller('profiles')
@UseInterceptors(ClassSerializerInterceptor)
export class ProfilesController {

  constructor(private profilesService: ProfilesService) {}

  @Get(':id')
  async getProfile(@Request() req, @Param('id') id: string): Promise<ProfileWithRelationsDto> {
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
  async create(@Request() req, @Body() dto: CreateProfileDto): Promise<ProfileWithRelationsDto> {
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

  @Get(':cid/tags')
  async getCategories(@Request() req: ProfileRequest): Promise<TagModel[]> {
    const { profile } = req;
    return profile.tags.map((category) => new TagModel(category));
  }
}
