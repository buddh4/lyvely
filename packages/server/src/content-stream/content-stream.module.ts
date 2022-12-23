import { Module } from '@nestjs/common';
import { ContentStreamController } from '@/content-stream/controllers/content-stream.controller';
import { ContentStreamService } from '@/content-stream/services/content-stream.service';
import { ContentModule } from '@/content';
import { ProfilesModule } from '@/profiles';

@Module({
  controllers: [ContentStreamController],
  providers: [ContentStreamService],
  imports: [ContentModule, ProfilesModule],
})
export class ContentStreamModule {}
