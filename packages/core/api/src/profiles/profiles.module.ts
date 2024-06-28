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
  ProfileScore,
  ProfileScoreSchema,
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
  ProfileMembershipAvatarService,
  ProfileAvatarService,
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
import { ProfilesDao, MembershipsDao, UserProfileRelationsDao, ProfileScoreDao } from './daos';

import { ProfileVisibilityPolicy } from './policies';
import { PoliciesModule } from '@/policies';
import { LyvelyModule } from '@/core';
import {
  PROFILES_MODULE_ID,
  ProfileType,
  AddProfileToOrganizationPermission,
  CreateOrganizationProfilePermission,
  CreateGroupProfilePermission,
  CreateUserProfilePermission,
  ManageTagsPermission,
} from '@lyvely/interface';
import { useProfileMappings } from './mappings';
import { ProfilesEvents } from './profiles.events';
import { ProfileMembershipPolicy } from '@/profiles/policies/profile-membership-policy';
import { Inject, Injectable, OnModuleInit, Scope, Type } from '@nestjs/common';
import { DynamicModule } from '@nestjs/common/interfaces/modules/dynamic-module.interface';
import { uniqueId } from '@lyvely/common';
import { ProfileScoreTypeRegistry } from '@/profiles/registires';
import { AvatarsModule } from '../avatars';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigFactory } from '../files';

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
  {
    name: ProfileScore.name,
    collection: ProfileScore.collectionName(),
    schema: ProfileScoreSchema,
  },
]);

useProfileMappings();

@LyvelyModule({
  id: PROFILES_MODULE_ID,
  name: 'Profiles',
  path: __dirname,
  policies: [ProfileVisibilityPolicy, ProfileMembershipPolicy],
  permissions: [
    AddProfileToOrganizationPermission,
    CreateOrganizationProfilePermission,
    CreateGroupProfilePermission,
    CreateUserProfilePermission,
    ManageTagsPermission,
  ],
  imports: [
    UsersModule,
    PoliciesModule,
    AvatarsModule,
    ProfileModel,
    MulterModule.registerAsync({
      useClass: MulterConfigFactory,
    }),
  ],
  providers: [
    ProfilesDao,
    ProfileScoreTypeRegistry,
    ProfileScoreDao,
    ProfilePermissionsService,
    ProfilePermissionSettingsService,
    UserProfileRelationsDao,
    MembershipsDao,
    ProfileMembershipService,
    ProfileMembershipAvatarService,
    ProfilesService,
    ProfileAvatarService,
    ProfileTagsService,
    ProfileUrlGenerator,
    ProfileFeaturesService,
    ProfileSettingsService,
    ProfileRelationsService,
    UserSettingsService,
    ProfileSettingsRegistry,
    ProfileScoreTypeRegistry,
    ProfilesEvents,
  ],
  exports: [
    ProfilesService,
    ProfilesDao,
    ProfileScoreDao,
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
export class ProfilesModule {
  static registerProfileScoreType(...profileScoreTypes: Type<ProfileScore>[]): DynamicModule {
    return {
      module: ProfilesModule,
      providers: [
        {
          provide: `ProfileTypeRegistration${uniqueId('ProfileScoreTypeRegistration')}`,
          useClass: registerProfileScoreTypeOnInit(profileScoreTypes),
        },
      ],
    };
  }
}

function registerProfileScoreTypeOnInit(profileScoreTypes: Type<ProfileScore>[]) {
  @Injectable({ scope: Scope.DEFAULT })
  class RegisterContentTypeService implements OnModuleInit {
    @Inject()
    private registry: ProfileScoreTypeRegistry;

    onModuleInit(): any {
      if (profileScoreTypes && profileScoreTypes.length) {
        this.registry.registerTypes(profileScoreTypes.map((type) => ({ type })));
      }
    }
  }

  return RegisterContentTypeService;
}
