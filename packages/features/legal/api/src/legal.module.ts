import { Module } from '@nestjs/common';
import { LegalController } from './controllers';
import { LegalService } from './services';
import { LegalEvents } from './legal.events';

@Module({
  imports: [],
  controllers: [LegalController],
  providers: [LegalService, LegalEvents],
  exports: [LegalService],
})
export class LegalModule {}
