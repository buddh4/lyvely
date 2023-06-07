import { Module } from '@nestjs/common';
import { LegalController } from './controllers/legal-controller';
import { LegalService } from '@/legal/services/legal.service';

@Module({
  imports: [],
  controllers: [LegalController],
  providers: [LegalService],
  exports: [LegalService],
})
export class LegalModule {}
