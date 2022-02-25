import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema,
  UserProfileRelation, UserProfileRelationSchema,
  Membership, MembershipSchema} from './schemas';
import { ProfilesService } from './services';
import { ProfilesController } from './controllers';
import { UsersModule } from '../users/users.module';
import { ProfileDao , MembershipsDao, UserProfileRelationsDao } from './daos';

import { ProfileVisibilityPolicy } from './policies';
import { PoliciesModule } from '../policies/policies.module';
import { ProfilePermissionsService } from '../permissions/services/profile-permissions.service';
import { ProfileEvents } from './profile.events';
import { CoreModule } from '../core/core.module';

export const ProfileModel = MongooseModule.forFeature([
  { name: Profile.name, schema: ProfileSchema },
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
    ProfileVisibilityPolicy,
  ],
  exports: [
    ProfilesService,
    ProfileDao,
    ProfileModel,
    ProfilePermissionsService,
    UserProfileRelationsDao,
    ProfileVisibilityPolicy,
    MembershipsDao
  ],
  controllers: [
    ProfilesController
  ],
})
export class ProfilesModule {}
