import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Profile, ProfileSchema,
  UserProfileRelation, UserProfileRelationSchema,
  Membership, MembershipSchema, UserProfileSchema, GroupProfileSchema, OrganizationSchema
} from './schemas';
import { ProfilesService, ProfileTagsService } from './services';
import { ProfilesController } from './controllers';
import { UsersModule } from '../users';
import { ProfileDao , MembershipsDao, UserProfileRelationsDao } from './daos';

import { ProfileVisibilityPolicy } from './policies';
import { PoliciesModule } from '../policies/policies.module';
import { ProfilePermissionsService } from '../permissions/services/profile-permissions.service';
import { ProfileEvents } from './profile.events';
import { CoreModule } from '../../core/core.module';
import { ProfileTagsController } from "./controllers/profile-tags.controller";
import { ProfileRelationsController } from "./controllers/profile-relations.controller";
import { ProfileType } from "@lyvely/common";

export const ProfileModel = MongooseModule.forFeature([
  {
    name: Profile.name,
    schema: ProfileSchema,
    discriminators: [
      { name: ProfileType.User, schema: UserProfileSchema },
      { name: ProfileType.Group, schema: GroupProfileSchema },
      { name: ProfileType.Organization, schema: OrganizationSchema },
    ]
  },
  {
    name: UserProfileRelation.name,
    schema: UserProfileRelationSchema,
    discriminators: [
      { name: Membership.name, schema: MembershipSchema }
    ],
  },
]);

@Module({
  imports: [
    CoreModule,
    UsersModule,
    PoliciesModule,
    ProfileModel
  ],
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
    MembershipsDao
  ],
  controllers: [
    ProfilesController,
    ProfileTagsController,
    ProfileRelationsController
  ],
})
export class ProfilesModule {}