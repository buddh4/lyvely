import {
  Body,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
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
import { GlobalController } from '@/common';
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
  UserRole,
} from '@lyvely/interface';
import { ProfileAvatarService, ProfileRelationsService, ProfilesService } from '../services';
import { ProfileContext, ProtectedProfileContext } from '../contexts';
import {
  OptionalUserRequest,
  UserRequest,
  UserRoleAccess,
  UserThrottle,
  UserThrottlerGuard,
} from '@/users';
import { ProfileVisibilityPolicy } from '../policies';
import { InjectPolicy } from '@/policies';
import { ProfileMembershipRequest, ProfileRequest } from '../types';
import { ProfileEndpoint, ProfileRoleAccess } from '../decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { AvatarUploadPipe } from '@/avatars';
import type { IFileInfo } from '@/files';

/**
 * Implementation of the ProfilesEndpoint service
 * @class
 * @public
 * @constructs ProfilesController
 * @param {ProfilesService} profilesService - The profiles service.
 * @param {ProfileRelationsService} profilesRelationsService - The profile relations service.
 * @param {ProfileVisibilityPolicy} profileVisibilityPolicy - The profile visibility policy.
 */
@GlobalController(API_PROFILES)
@UseClassSerializer()
export class ProfilesController implements ProfilesEndpoint {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly profileAvatarService: ProfileAvatarService,
    private readonly profilesRelationsService: ProfileRelationsService,
    @InjectPolicy(ProfileVisibilityPolicy.name)
    private readonly profileVisibilityPolicy: ProfileVisibilityPolicy
  ) {}

  @Post()
  @UserRoleAccess(UserRole.User)
  async create(
    @Body() model: CreateProfileModel,
    @Request() req: UserRequest
  ): Promise<ProfileWithRelationsModel> {
    // Note, further permissions are checked in the service.
    const { user } = req;

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
  @ProfileEndpoint()
  async getProfileByHandle(
    @Param('handle') handle: string,
    @Request() req: ProfileRequest
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
  @ProfileRoleAccess(ProfileRelationRole.Admin)
  async update(
    @Body() model: UpdateProfileModel,
    @Request() req: ProfileMembershipRequest
  ): Promise<ProfileWithRelationsModel> {
    const { profile, context } = req;
    await this.profilesService.updateProfile(profile, model);
    return this.mapAndPopulateProfileWithRelations(context);
  }

  @Put(ProfilesEndpoints.ARCHIVE)
  @ProfileEndpoint()
  @ProfileRoleAccess(ProfileRelationRole.Owner)
  @HttpCode(HttpStatus.NO_CONTENT)
  async archive(@Request() req: ProfileMembershipRequest): Promise<void> {
    await this.profilesService.archive(req.profile);
  }

  @Put(ProfilesEndpoints.RESTORE)
  @ProfileEndpoint()
  @ProfileRoleAccess(ProfileRelationRole.Owner)
  @HttpCode(HttpStatus.NO_CONTENT)
  async restore(@Request() req: ProfileMembershipRequest): Promise<void> {
    await this.profilesService.restore(req.profile);
  }

  @Put(ProfilesEndpoints.UPDATE_AVATAR)
  @ProfileEndpoint()
  @ProfileRoleAccess(ProfileRelationRole.Admin)
  @UseGuards(UserThrottlerGuard)
  @UserThrottle(20, 60_000)
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(
    @UploadedFile(AvatarUploadPipe) file: IFileInfo,
    @Req() req: ProfileMembershipRequest
  ): Promise<AvatarModel> {
    const avatar = await this.profileAvatarService.updateAvatar(req.context, file);
    return new AvatarModel(avatar);
  }

  @ProfileEndpoint()
  @ProfileRoleAccess(ProfileRelationRole.Admin)
  @Post(ProfilesEndpoints.SET_CALENDAR_PREFERENCES)
  async setCalendarPreferences(
    @Body() model: CalendarPreferences,
    @Req() req: ProfileMembershipRequest
  ): Promise<SettingsUpdateResponse> {
    const { profile, context } = req;
    if (!context.getMembership(ProfileMembershipRole.Admin, ProfileMembershipRole.Owner)) {
      throw new ForbiddenException();
    }

    const settings = await this.profilesService.setCalendarPreferences(profile, model);
    return new SettingsUpdateResponse({ settings });
  }

  private async mapAndPopulateProfileWithRelations(
    context: ProfileContext
  ): Promise<ProfileWithRelationsModel> {
    return assignRawDataTo(mapType(ProfileContext, ProfileWithRelationsModel<any>, context), {
      profileRelations: await this.profilesRelationsService.findProfileRelations(context.profile),
    });
  }
}
