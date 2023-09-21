import { Module, Global } from '@nestjs/common';
import { AppConfigController } from './controllers/app-config.controller';
import { LegalModule } from '@lyvely/legal';

@Global()
@Module({
  controllers: [AppConfigController],
  imports: [LegalModule],
})
export class AppConfigModule {}
