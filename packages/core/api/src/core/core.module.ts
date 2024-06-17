import { Global } from '@nestjs/common';
import { ModuleEventsService, UrlGenerator } from './services';
import { LyvelyModule } from './decorators';
import { ModuleRegistry, useModuleRegistry } from './components';
import { TenancyService } from '@/core/tenancy';

@Global()
@LyvelyModule({
  id: 'core',
  name: 'Core',
  path: __dirname,
  description: 'Lyvely core module',
  controllers: [],
  providers: [
    UrlGenerator,
    {
      provide: ModuleRegistry,
      useValue: useModuleRegistry(),
    },
    ModuleEventsService,
    TenancyService,
  ],
  exports: [UrlGenerator, ModuleRegistry, TenancyService],
})
export class CoreModule {}
