import { Module } from '@nestjs/common';
import { ContentStreamService } from './services';
import { ProfilesModule } from '@/profiles';
import { ContentStreamController } from './controllers';
import { ContentModule } from '@/content';

@Module({
  controllers: [ContentStreamController],
  providers: [ContentStreamService],
  imports: [ContentModule, ProfilesModule],
})
export class ContentStreamModule {}
