import { MongooseModule } from '@nestjs/mongoose';
import {
  Profile,
  ProfileSchema,
  UserProfileRelation,
  UserProfileRelationSchema,
  Membership,
  MembershipSchema,
  UserProfileSchema,
  GroupProfileSchema,
  OrganizationSchema,
} from './schemas';
import {
  ProfilesService,
  ProfileTagsService,
  ProfilePermissionsService,
  ProfileMembershipService,
  ProfileUrlGenerator,
  ProfileFeaturesService,
  ProfileSettingsService,
  ProfileRelationsService,
  ProfileSettingsRegistry,
  ProfilePermissionSettingsService,
} from './services';
import {
  ProfilesController,
  ProfileTagsController,
  ProfileRelationInfosController,
  ProfileMembershipController,
  ProfileFeaturesController,
  ProfilePermissionsController,
} from './controllers';
import { UserSettingsService, UsersModule } from '@/users';
import { ProfileDao, MembershipsDao, UserProfileRelationsDao } from './daos';

import { ProfileVisibilityPolicy } from './policies';
import { PoliciesModule } from '@/policies';
import { CoreModule, LyvelyModule } from '@/core';
import { PROFILES_MODULE_ID, ProfileType } from '@lyvely/interface';
import { useProfileMappings } from './mappings';
import { ProfilesEvents } from './profiles.events';
import { ProfileMembershipPolicy } from '@/profiles/policies/profile-membership-policy';

const ProfileModel = MongooseModule.forFeature([
  {
    name: Profile.name,
    schema: ProfileSchema,
    discriminators: [
      { name: ProfileType.User, schema: UserProfileSchema },
      { name: ProfileType.Group, schema: GroupProfileSchema },
      { name: ProfileType.Organization, schema: OrganizationSchema },
    ],
  },
  {
    name: UserProfileRelation.name,
    schema: UserProfileRelationSchema,
    discriminators: [{ name: Membership.name, schema: MembershipSchema }],
  },
]);

useProfileMappings();

@LyvelyModule({
  id: PROFILES_MODULE_ID,
  name: 'Profiles',
  path: __dirname,
  policies: [ProfileVisibilityPolicy, ProfileMembershipPolicy],
  imports: [CoreModule, UsersModule, PoliciesModule, ProfileModel],
  providers: [
    ProfileDao,
    ProfilePermissionsService,
    ProfilePermissionSettingsService,
    UserProfileRelationsDao,
    MembershipsDao,
    ProfileMembershipService,
    ProfilesService,
    ProfileTagsService,
    ProfileUrlGenerator,
    ProfileFeaturesService,
    ProfileSettingsService,
    ProfileRelationsService,
    UserSettingsService,
    ProfileSettingsRegistry,
    ProfilesEvents,
  ],
  exports: [
    ProfilesService,
    ProfileDao,
    ProfileTagsService,
    ProfileModel,
    ProfilePermissionsService,
    UserProfileRelationsDao,
    MembershipsDao,
    ProfileSettingsService,
    ProfileMembershipService,
    ProfileRelationsService,
    UserSettingsService,
    ProfileSettingsRegistry,
  ],
  controllers: [
    ProfilesController,
    ProfileTagsController,
    ProfileRelationInfosController,
    ProfileMembershipController,
    ProfileFeaturesController,
    ProfilePermissionsController,
  ],
})
export class ProfilesModule {}
