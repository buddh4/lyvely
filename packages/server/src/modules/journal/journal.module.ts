/*import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Journal,
  JournalLog,
  JournalLogSchema,
  JournalSchema,
} from './schemas/journal.schema';
import { JournalsController } from './journals.controller';
import { JournalsService } from './journals.service';
import { UsersModule } from '../users/users.module';
import { JournalLogsService } from './journallogs.service';
import { Content, ContentSchema } from '../content';
import { ProfilesModule } from '../profiles';

@Module({
  imports: [
    UsersModule,
    ProfilesModule,
    MongooseModule.forFeature([
      {
        name: Content.name,
        schema: ContentSchema,
        discriminators: [{ name: Journal.name, schema: JournalSchema }],
      },
      { name: JournalLog.name, schema: JournalLogSchema },
    ]),
  ],
  controllers: [JournalsController],
  providers: [JournalsService, JournalLogsService],
})
export class JournalModule {}
 */
