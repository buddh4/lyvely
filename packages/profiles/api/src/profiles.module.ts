import { Module } from '@nestjs/common';
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
import { ProfilesService, ProfileTagsService, ProfilePermissionsService } from './services';
import {
  ProfilesController,
  ProfileTagsController,
  ProfileRelationInfosController,
} from './controllers';
import { UsersModule } from '@lyvely/users';
import { ProfileDao, MembershipsDao, UserProfileRelationsDao } from './daos';

import { ProfileVisibilityPolicy } from './policies';
import { PoliciesModule } from '@lyvely/policies';
import { CoreModule } from '@lyvely/core';
import { ProfileType } from '@lyvely/common';
import { useProfileMappings } from './mappings';
import { ProfileMembershipController } from './controllers/profile-membership.controller';
import { ProfileMembershipService, ProfileUrlGenerator } from './services';

export const ProfileModel = MongooseModule.forFeature([
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

@Module({
  imports: [CoreModule, UsersModule, PoliciesModule, ProfileModel],
  providers: [
    ProfileDao,
    ProfilePermissionsService,
    UserProfileRelationsDao,
    MembershipsDao,
    ProfileMembershipService,
    ProfilesService,
    ProfileTagsService,
    ProfileVisibilityPolicy,
    ProfileUrlGenerator,
  ],
  exports: [
    ProfilesService,
    ProfileDao,
    ProfileTagsService,
    ProfileModel,
    ProfilePermissionsService,
    UserProfileRelationsDao,
    ProfileVisibilityPolicy,
    MembershipsDao,
  ],
  controllers: [
    ProfilesController,
    ProfileTagsController,
    ProfileRelationInfosController,
    ProfileMembershipController,
  ],
})
export class ProfilesModule {}
