import { Injectable, Logger } from '@nestjs/common';
import { AbstractTypeRegistry } from './abstract-type.registry';
import { IModuleMetadata } from '../interfaces';
import { useSingleton } from '@lyvely/common';

@Injectable()
export class ModuleRegistry<TView = any> extends AbstractTypeRegistry<
  any,
  IModuleMetadata<TView>,
  TView
> {
  protected logger = new Logger(ModuleRegistry.name);
}

export const useModuleRegistry = useSingleton(() => new ModuleRegistry());
