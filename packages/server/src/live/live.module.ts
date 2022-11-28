import { Module } from '@nestjs/common';
import { LiveController } from '@/live/controllers/live.controller';
import { ProfilesModule } from '@/profiles';
import { LiveService } from '@/live/services';

@Module({
  controllers: [LiveController],
  imports: [ProfilesModule],
  providers: [LiveService],
})
export class LiveModule {}
