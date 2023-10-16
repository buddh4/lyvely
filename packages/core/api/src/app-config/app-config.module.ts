import { Module, Global } from '@nestjs/common';
import { AppConfigController } from './controllers';
import { AppConfigService } from '@/app-config/services';

@Global()
@Module({
  controllers: [AppConfigController],
  providers: [AppConfigService],
})
export class AppConfigModule {}
