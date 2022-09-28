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
import { ProfilesController, ProfileTagsController, ProfileRelationInfosController } from './controllers';
import { UsersModule } from '../users';
import { ProfileDao, MembershipsDao, UserProfileRelationsDao } from './daos';

import { ProfileVisibilityPolicy } from './policies';
import { PoliciesModule } from '../policies/policies.module';
import { ProfileEvents } from './profile.events';
import { CoreModule } from '../core/core.module';
import { ProfileType } from '@lyvely/common';
import { useProfileMappings } from './mappings';

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
    ProfileEvents,
    ProfileDao,
    ProfilePermissionsService,
    UserProfileRelationsDao,
    MembershipsDao,
    ProfilesService,
    ProfileTagsService,
    ProfileVisibilityPolicy,
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
  controllers: [ProfilesController, ProfileTagsController, ProfileRelationInfosController],
})
export class ProfilesModule {}
