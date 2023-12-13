import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UseClassSerializer } from '@/core';
import { mapType } from '@lyvely/common';
import {
  API_PROFILES,
  CalendarPreferences,
  CreateProfileModel,
  ProfileMembershipRole,
  ProfilesEndpoint,
  ProfilesEndpoints,
  ProfileType,
  ProfileWithRelationsModel,
  SettingsUpdateResponse,
  UpdateProfileModel,
} from '@lyvely/interface';
import { ProfileRelationsService, ProfilesService } from '../services';
import { ProfileContext, ProtectedProfileContext } from '../models';
import { OptionalUserRequest, UserRequest } from '@/users';
import { ProfileVisibilityPolicy } from '../policies';
import { InjectPolicy } from '@/policies';
import { ProfileRequest, ProtectedProfileRequest } from '../types';
import { ProfileEndpoint } from '../decorators';
import { ProfileGuard } from '../guards';

/**
 * Implementation of the ProfilesEndpoint service
 * @class
 * @public
 * @constructs ProfilesController
 * @param {ProfilesService} profilesService - The profiles service.
 * @param {ProfileRelationsService} profilesRelationsService - The profile relations service.
 * @param {ProfileVisibilityPolicy} profileVisibilityPolicy - The profile visibility policy.
 */
@Controller(API_PROFILES)
@UseClassSerializer()
export class ProfilesController implements ProfilesEndpoint {
  constructor(
    private profilesService: ProfilesService,
    private profilesRelationsService: ProfileRelationsService,
    @InjectPolicy(ProfileVisibilityPolicy.name)
    private profileVisibilityPolicy: ProfileVisibilityPolicy,
  ) {}

  @Post()
  async create(
    @Body() model: CreateProfileModel,
    @Request() req: UserRequest,
  ): Promise<ProfileWithRelationsModel> {
    const { user } = req;

    if (!user) throw new ForbiddenException();

    // TODO: (ACL) check if user is allowed to create profiles
    let profileRelations;

    switch (model.type) {
      case ProfileType.User:
        profileRelations = await this.profilesService.createUserProfile(user, model);
        break;
      case ProfileType.Group:
        profileRelations = await this.profilesService.createUserProfile(user, model);
        break;
      case ProfileType.Organization:
        profileRelations = await this.profilesService.createOrganization(user, model);
        break;
    }

    return mapType(ProtectedProfileContext, ProfileWithRelationsModel<any>, profileRelations);
  }

  @Get()
  async getDefaultProfile(@Request() req: OptionalUserRequest): Promise<ProfileWithRelationsModel> {
    const { user } = req;
    const context = await this.profilesService.findDefaultProfile(user);
    if (!(await this.profileVisibilityPolicy.verify(context))) throw new ForbiddenException();
    return this.mapAndPopulateProfileWithRelations(context);
  }

  @UseGuards(ProfileGuard)
  @Get(ProfilesEndpoints.BY_HANDLE(':handle'))
  async getProfileByHandle(
    @Param('handle') handle: string,
    @Request() req: ProfileRequest,
  ): Promise<ProfileWithRelationsModel> {
    const { context } = req;
    return this.mapAndPopulateProfileWithRelations(context);
  }

  @ProfileEndpoint()
  @Get(':pid')
  async getProfileById(@Request() req: ProfileRequest): Promise<ProfileWithRelationsModel> {
    const { context } = req;
    return this.mapAndPopulateProfileWithRelations(context);
  }

  @ProfileEndpoint()
  @Put()
  async update(
    @Body() model: UpdateProfileModel,
    @Request() req: ProtectedProfileRequest,
  ): Promise<ProfileWithRelationsModel> {
    const { profile, context } = req;

    // TODO: Use ACL
    if (!context.getMembership(ProfileMembershipRole.Admin, ProfileMembershipRole.Owner)) {
      throw new ForbiddenException();
    }

    await this.profilesService.updateProfile(profile, model);
    return this.mapAndPopulateProfileWithRelations(context);
  }

  @ProfileEndpoint()
  @Post(ProfilesEndpoints.SET_CALENDAR_PREFERENCES)
  async setCalendarPreferences(
    @Body() model: CalendarPreferences,
    @Req() req: ProtectedProfileRequest,
  ): Promise<SettingsUpdateResponse> {
    const { profile, context } = req;
    // TODO: Use ACL
    if (!context.getMembership(ProfileMembershipRole.Admin, ProfileMembershipRole.Owner)) {
      throw new ForbiddenException();
    }

    const settings = await this.profilesService.setCalendarPreferences(profile, model);
    return new SettingsUpdateResponse({ settings });
  }

  private async mapAndPopulateProfileWithRelations(context: ProfileContext) {
    const profileWithRelations = mapType(ProfileContext, ProfileWithRelationsModel<any>, context);
    profileWithRelations.profileRelations =
      await this.profilesRelationsService.findProfileRelations(context.profile);
    return profileWithRelations;
  }
}
