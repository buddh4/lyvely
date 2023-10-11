import { Module, Global, DynamicModule } from '@nestjs/common';
import { usePolicyRegistry } from './components';

@Global()
@Module({})
export class PoliciesModule {
  static forRoot(): DynamicModule {
    const providers = usePolicyRegistry().getProviders();
    return {
      module: PoliciesModule,
      global: true,
      providers,
      exports: providers,
    };
  }
}
