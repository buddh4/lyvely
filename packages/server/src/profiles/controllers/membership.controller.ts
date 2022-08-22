import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param, Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProfilesDto, ProfileDto , TagDto , UserDto , CreateProfileDto } from '@lyvely/common';




@Controller('memberships')
@UseInterceptors(ClassSerializerInterceptor)
export class MembershipController {

  /*
  @Get()
  async getMemberships(@Request() req): Promise<ProfilesDto> {
    const profiles = await this.profilesService.findAllMemberProfilesByUser(req.user);
    return new ProfilesDto({
      user: new UserDto(req.user),
      profiles: profiles.map((profile) => new ProfileDto(profile)),
    });
  }

  @Post()
  async create(@Request() req, @Body() dto: CreateProfileDto): Promise<ProfileDto> {
    // TODO: (TEAM) check if user is allowed to create team profiles
    return new ProfileDto(await this.profilesService.createProfile(req.user, dto.name, dto.type));
  }

  @Get(':profile/tags')
  async getCategories(@Request() req, @Param('profile') pid: string): Promise<TagDto[]> {
    const profile = await this.findProfileByUserAndId(req.user, pid);
    if (!profile) {
      throw new NotFoundException();
    }

    return profile.tags.map((tags) => new TagDto(tags));
  }*/
}
