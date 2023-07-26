import { Module, Global } from '@nestjs/common';
import { PolicyService } from './services';

@Global()
@Module({
  providers: [PolicyService],
  exports: [PolicyService],
})
export class PoliciesModule {}
