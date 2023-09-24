import { Module } from '@nestjs/common';
import { LegalController } from './controllers';
import { LegalService } from './services';

@Module({
  imports: [],
  controllers: [LegalController],
  providers: [LegalService],
  exports: [LegalService],
})
export class LegalModule {}
