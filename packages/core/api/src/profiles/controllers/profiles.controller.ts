import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UseClassSerializer } from '@/core';
import { mapType } from '@lyvely/common';
import {
  CreateProfileModel,
  ENDPOINT_PROFILES,
  ProfileMembershipRole,
  ProfilesEndpoint,
  ProfileType,
  ProfileWithRelationsModel,
  UpdateProfileModel,
} from '@lyvely/core-interface';
import { ProfilesService } from '../services';
import { ProfileRelations, ProtectedProfileContext } from '../models';
import { OptionalUser, OptionalUserRequest, UserRequest } from '@/users';
import { ProfileVisibilityPolicy } from '../policies';
import { InjectPolicy } from '@/policies';
import { ProtectedProfileRequest } from '../types';
import { ProfileGuard } from '../guards';

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
    @Body() model: CreateProfileModel,
    @Request() req: UserRequest,
  ): Promise<ProfileWithRelationsModel> {
    const { user } = req;

    if (!user) throw new ForbiddenException();

    // TODO: (Permissions) check if user is allowed to create profiles
    let profileRelations;
    if (model.type === ProfileType.User) {
      profileRelations = await this.profilesService.createUserProfile(user, model);
    } else if (model.type === ProfileType.Group) {
      profileRelations = await this.profilesService.createGroupProfile(user, model);
    } else if (model.type === ProfileType.Organization) {
      profileRelations = await this.profilesService.createOrganization(user, model);
    }

    return mapType(ProtectedProfileContext, ProfileWithRelationsModel<any>, profileRelations);
  }

  @Put()
  @UseGuards(ProfileGuard)
  async update(
    @Body() model: UpdateProfileModel,
    @Request() req: ProtectedProfileRequest,
  ): Promise<ProfileWithRelationsModel> {
    const { profile, context } = req;

    // TODO: Use ACL
    if (!context.getMembership(ProfileMembershipRole.Admin, ProfileMembershipRole.Owner))
      throw new ForbiddenException();

    await this.profilesService.updateProfile(profile, model);

    return mapType(ProtectedProfileContext, ProfileWithRelationsModel<any>, context);
  }
}
