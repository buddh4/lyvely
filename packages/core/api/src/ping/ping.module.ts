import { Module, Global } from '@nestjs/common';
import { PingController } from './ping.controller';
import { AppConfigService } from '@/app-config/services';

@Global()
@Module({
  controllers: [PingController],
  providers: [AppConfigService],
})
export class PingModule {}
