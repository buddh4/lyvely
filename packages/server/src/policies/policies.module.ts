import { Module, Global } from '@nestjs/common';
import { PolicyService } from './services/policy.service';

@Global()
@Module({
  providers: [PolicyService],
  exports: [PolicyService],
})
export class PoliciesModule {}
