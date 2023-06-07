import { Module, Global } from '@nestjs/common';
import { AppConfigController } from './controllers/app-config.controller';
import { LegalModule } from '@/legal/legal.module';

@Global()
@Module({
  controllers: [AppConfigController],
  imports: [LegalModule],
})
export class AppConfigModule {}
