import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '@lyvely/users';
import { ContentModule, getContentModelDefinition } from '@lyvely/content';
import { ProfilesModule } from '@lyvely/profiles';
import { PoliciesModule } from '@lyvely/policies';
import { CoreModule } from '@lyvely/core';
import { Milestone, MilestoneSchema } from './schemas';
import { MilestonePlanController, MilestonesController } from './controllers';
import { MilestonesDao } from './daos';
import {
  MilestonesService,
  MilestonesRelationsService,
  MilestonesCalendarPlanService,
} from './services';

@Module({
  imports: [
    CoreModule,
    UsersModule,
    PoliciesModule,
    ProfilesModule,
    ContentModule.registerContentType(Milestone),
    MongooseModule.forFeature([
      getContentModelDefinition([{ name: Milestone.name, schema: MilestoneSchema }]),
    ]),
  ],
  controllers: [MilestonesController, MilestonePlanController],
  providers: [
    MilestonesDao,
    MilestonesService,
    MilestonesCalendarPlanService,
    MilestonesRelationsService,
  ],
})
export class MilestonesModule {}
