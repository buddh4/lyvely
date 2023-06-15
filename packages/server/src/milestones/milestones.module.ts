import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '@/users';
import { ContentModule, getContentModelDefinition } from '@/content';
import { ProfilesModule } from '@/profiles';
import { PoliciesModule } from '@/policies/policies.module';
import { CoreModule } from '@lyvely/server-core';
import { Milestone, MilestoneSchema } from './schemas';
import { MilestonesController } from '@/milestones/controllers/milestones.controller';
import { MilestonesDao } from '@/milestones/daos';
import { MilestonesService } from '@/milestones/services';
import { MilestonesRelationsService } from '@/milestones/services/milestones-relations.service';
import { MilestonesCalendarPlanService } from '@/milestones/services/milestones-calendar-plan.service';
import { MilestonePlanController } from '@/milestones/controllers/milestone-plan.controller';

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
