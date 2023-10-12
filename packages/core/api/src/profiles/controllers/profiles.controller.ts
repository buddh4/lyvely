import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { UseClassSerializer } from '@/core';
import { mapType } from '@lyvely/common';
import {
  CreateProfileModel,
  ENDPOINT_PROFILES,
  ProfilesEndpoint,
  ProfileType,
  ProfileWithRelationsModel,
} from '@lyvely/core-interface';
import { ProfilesService } from '../services';
import { ProfileRelations, ProtectedProfileContext } from '../models';
import { OptionalUser, OptionalUserRequest, UserRequest } from '@/users';
import { ProfileVisibilityPolicy } from '../policies';
import { InjectPolicy } from '@/policies';

@Controller(ENDPOINT_PROFILES)
@UseClassSerializer()
export class ProfilesController implements ProfilesEndpoint {
  constructor(
    private profilesService: ProfilesService,
    @InjectPolicy(ProfileVisibilityPolicy.name)
    private profileVisibilityPolicy: ProfileVisibilityPolicy,
  ) {}

  @Get(':id')
  async getProfile(
    @Param('id') pid: string,
    @Request() req: OptionalUserRequest,
    @Query('oid') oid?: string,
  ): Promise<ProfileWithRelationsModel> {
    const { user } = req;
    if (pid === 'default') return this.getDefaultProfile(user);

    // TODO: Here we could potentially save one db call when fetching user relations
    const context = await this.profilesService.findProfileContext(user, pid, oid);
    const profileRelations = await this.profilesService.findProfileRelations(user, context.profile);

    if (!(await this.profileVisibilityPolicy.verify(context))) throw new ForbiddenException();

    return mapType(ProfileRelations, ProfileWithRelationsModel<any>, profileRelations);
  }

  private async getDefaultProfile(user: OptionalUser): Promise<ProfileWithRelationsModel> {
    if (!user) throw new ForbiddenException();
    const profileRelations = await this.profilesService.findDefaultProfileMembershipByUser(user);
    return mapType(ProtectedProfileContext, ProfileWithRelationsModel<any>, profileRelations);
  }

  @Post()
  async create(
    @Body() dto: CreateProfileModel,
    @Request() req: UserRequest,
  ): Promise<ProfileWithRelationsModel> {
    const { user } = req;

    if (!user) throw new ForbiddenException();

    // TODO: (Permissions) check if user is allowed to create profiles
    let profileRelations;
    if (dto.type === ProfileType.User) {
      profileRelations = await this.profilesService.createUserProfile(user, dto);
    } else if (dto.type === ProfileType.Group) {
      profileRelations = await this.profilesService.createGroupProfile(user, dto);
    } else if (dto.type === ProfileType.Organization) {
      profileRelations = await this.profilesService.createOrganization(user, dto);
    }

    return mapType(ProtectedProfileContext, ProfileWithRelationsModel<any>, profileRelations);
  }
}
