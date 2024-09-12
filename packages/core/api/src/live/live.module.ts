import { Global, Module } from '@nestjs/common';
import { LiveController } from './controllers';
import { ProfilesModule } from '@/profiles';
import { LiveService } from './services';

@Global()
@Module({
  controllers: [LiveController],
  imports: [ProfilesModule],
  providers: [LiveService],
  exports: [LiveService],
})
export class LiveModule {}
