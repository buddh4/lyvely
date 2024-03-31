import {
  Body,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Req,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UseClassSerializer } from '@/core';
import { Controller } from '@/common';
import { assignRawDataTo, mapType } from '@lyvely/common';
import {
  API_PROFILES,
  AvatarModel,
  CalendarPreferences,
  CreateProfileModel,
  FieldValidationException,
  ProfileMembershipRole,
  ProfileRelationRole,
  ProfilesEndpoint,
  ProfilesEndpoints,
  ProfileType,
  ProfileWithRelationsModel,
  SettingsUpdateResponse,
  UpdateProfileModel,
} from '@lyvely/interface';
import { ProfileAvatarService, ProfileRelationsService, ProfilesService } from '../services';
import { ProfileContext, ProtectedProfileContext } from '../models';
import { OptionalUserRequest, UserRequest, UserThrottle, UserThrottlerGuard } from '@/users';
import { ProfileVisibilityPolicy } from '../policies';
import { InjectPolicy } from '@/policies';
import { ProfileMembershipRequest, ProfileRequest, ProtectedProfileRequest } from '../types';
import { ProfileEndpoint, ProfileRoleLevel } from '../decorators';
import { ProfileGuard } from '../guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadAvatarPipe } from '@/avatars';

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
    private readonly profilesService: ProfilesService,
    private readonly profileAvatarService: ProfileAvatarService,
    private readonly profilesRelationsService: ProfileRelationsService,
    @InjectPolicy(ProfileVisibilityPolicy.name)
    private readonly profileVisibilityPolicy: ProfileVisibilityPolicy,
  ) {}

  @Post()
  async create(
    @Body() model: CreateProfileModel,
    @Request() req: UserRequest,
  ): Promise<ProfileWithRelationsModel> {
    const { user } = req;

    if (!user) throw new ForbiddenException();

    // TODO: (ACL) check if user is allowed to create profiles
    let context: ProtectedProfileContext;

    switch (model.type) {
      case ProfileType.User:
        context = await this.profilesService.createUserProfile(user, model);
        break;
      case ProfileType.Group:
        context = await this.profilesService.createGroupProfile(user, model);
        break;
      case ProfileType.Organization:
        context = await this.profilesService.createOrganization(user, model);
        break;
      default:
        throw new FieldValidationException([{ property: 'type', errors: ['isValid'] }]);
    }

    return this.mapAndPopulateProfileWithRelations(context);
  }

  @Get()
  async getDefaultProfile(@Request() req: OptionalUserRequest): Promise<ProfileWithRelationsModel> {
    const { user } = req;
    const context = await this.profilesService.findDefaultProfile(user);
    if (!(await this.profileVisibilityPolicy.verify(context))) throw new ForbiddenException();
    return this.mapAndPopulateProfileWithRelations(context);
  }

  @Get(ProfilesEndpoints.BY_HANDLE(':handle'))
  @UseGuards(ProfileGuard)
  async getProfileByHandle(
    @Param('handle') handle: string,
    @Request() req: ProfileRequest,
  ): Promise<ProfileWithRelationsModel> {
    const { context } = req;
    return this.mapAndPopulateProfileWithRelations(context);
  }

  @Get(':pid')
  @ProfileEndpoint()
  async getProfileById(@Request() req: ProfileRequest): Promise<ProfileWithRelationsModel> {
    const { context } = req;
    return this.mapAndPopulateProfileWithRelations(context);
  }

  @Put(':pid')
  @ProfileEndpoint()
  @ProfileRoleLevel(ProfileRelationRole.Admin)
  async update(
    @Body() model: UpdateProfileModel,
    @Request() req: ProtectedProfileRequest,
  ): Promise<ProfileWithRelationsModel> {
    const { profile, context } = req;
    await this.profilesService.updateProfile(profile, model);
    return this.mapAndPopulateProfileWithRelations(context);
  }

  @Put(ProfilesEndpoints.UPDATE_AVATAR)
  @ProfileEndpoint()
  @ProfileRoleLevel(ProfileRelationRole.Admin)
  @UseGuards(UserThrottlerGuard)
  @UserThrottle(20, 60)
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(
    @UploadedFile(UploadAvatarPipe) file: Express.Multer.File,
    @Req() req: ProfileMembershipRequest,
  ): Promise<AvatarModel> {
    const avatar = await this.profileAvatarService.updateAvatar(req.context, file);
    return new AvatarModel(avatar);
  }

  @ProfileEndpoint()
  @ProfileRoleLevel(ProfileRelationRole.Admin)
  @ProfileEndpoint()
  @Post(ProfilesEndpoints.SET_CALENDAR_PREFERENCES)
  async setCalendarPreferences(
    @Body() model: CalendarPreferences,
    @Req() req: ProtectedProfileRequest,
  ): Promise<SettingsUpdateResponse> {
    const { profile, context } = req;
    if (!context.getMembership(ProfileMembershipRole.Admin, ProfileMembershipRole.Owner)) {
      throw new ForbiddenException();
    }

    const settings = await this.profilesService.setCalendarPreferences(profile, model);
    return new SettingsUpdateResponse({ settings });
  }

  private async mapAndPopulateProfileWithRelations(
    context: ProfileContext,
  ): Promise<ProfileWithRelationsModel> {
    return assignRawDataTo(mapType(ProfileContext, ProfileWithRelationsModel<any>, context), {
      profileRelations: await this.profilesRelationsService.findProfileRelations(context.profile),
    });
  }
}
