import { Module, Global, DynamicModule } from '@nestjs/common';
import { usePolicyRegistry } from './components';
import { PolicyService } from '@/policies/services';

@Global()
@Module({})
export class PoliciesModule {
  static forRoot(): DynamicModule {
    const providers = [...usePolicyRegistry().getProviders(), PolicyService];
    return {
      module: PoliciesModule,
      global: true,
      providers,
      exports: providers,
    };
  }
}
