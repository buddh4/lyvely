import { Global } from '@nestjs/common';
import { ModuleEventsService, UrlGenerator } from './services';
import { LyvelyModule } from './decorators/lyvely-module.decorator';
import { ModuleRegistry, useModuleRegistry } from './components';

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
  ],
  exports: [UrlGenerator, ModuleRegistry],
})
export class CoreModule {}
