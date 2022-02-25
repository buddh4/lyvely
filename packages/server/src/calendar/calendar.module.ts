import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Timing, TimingSchema } from './schemas/timing.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Timing.name, schema: TimingSchema },
    ]),
  ],
})
export class CalendarModule {}
