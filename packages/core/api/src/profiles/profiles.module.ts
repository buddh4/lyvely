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
} from './services';
import {
  ProfilesController,
  ProfileTagsController,
  ProfileRelationInfosController,
} from './controllers';
import { UsersModule } from '@/users';
import { ProfileDao, MembershipsDao, UserProfileRelationsDao } from './daos';

import { ProfileVisibilityPolicy } from './policies';
import { PoliciesModule } from '@/policies';
import { CoreModule, LyvelyModule } from '@/core';
import { ProfileType } from '@lyvely/core-interface';
import { useProfileMappings } from './mappings';
import { ProfileMembershipController } from './controllers/profile-membership.controller';

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
  id: 'profiles',
  name: 'Profiles',
  path: __dirname,
  policies: [ProfileVisibilityPolicy],
  imports: [CoreModule, UsersModule, PoliciesModule, ProfileModel],
  providers: [
    ProfileDao,
    ProfilePermissionsService,
    UserProfileRelationsDao,
    MembershipsDao,
    ProfileMembershipService,
    ProfilesService,
    ProfileTagsService,
    ProfileUrlGenerator,
  ],
  exports: [
    ProfilesService,
    ProfileDao,
    ProfileTagsService,
    ProfileModel,
    ProfilePermissionsService,
    UserProfileRelationsDao,
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
