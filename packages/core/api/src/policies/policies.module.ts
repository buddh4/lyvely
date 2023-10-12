import { Module, Global, DynamicModule, Logger } from '@nestjs/common';
import { usePolicyRegistry } from './components';

@Global()
@Module({})
export class PoliciesModule {
  static forRoot(): DynamicModule {
    const logger = new Logger('PoliciesModule');
    const providers = usePolicyRegistry().getProviders();
    logger.log(providers);
    return {
      module: PoliciesModule,
      global: true,
      providers,
      exports: providers,
    };
  }
}
