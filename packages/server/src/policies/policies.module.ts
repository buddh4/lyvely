import { Module } from '@nestjs/common';
import { PolicyService } from './services/policy.service';

@Module({
  providers: [PolicyService],
  exports: [PolicyService],
})
export class PoliciesModule {}
