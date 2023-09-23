import { Module, Global } from '@nestjs/common';
import { AppConfigController } from './controllers/app-config.controller';

@Global()
@Module({
  controllers: [AppConfigController],
})
export class AppConfigModule {}
