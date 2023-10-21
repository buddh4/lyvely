import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UsersModule,
  ContentModule,
  getContentModelDefinition,
  ProfilesModule,
  PoliciesModule,
  CoreModule,
  LyvelyModule,
} from '@lyvely/core';
import { Milestone, MilestoneSchema } from './schemas';
import { MilestonePlanController, MilestonesController } from './controllers';
import { MilestonesDao } from './daos';
import {
  MilestonesService,
  MilestonesRelationsService,
  MilestonesCalendarPlanService,
} from './services';
import {
  ActivityMilestonesFeature,
  MILESTONES_MODULE_ID,
  MilestonesFeature,
} from '@lyvely/milestones-interface';

@LyvelyModule({
  id: MILESTONES_MODULE_ID,
  name: 'Milestones',
  path: __dirname,
  features: [MilestonesFeature, ActivityMilestonesFeature],
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
