import { Injectable, Logger } from '@nestjs/common';
import { AbstractTypeRegistry } from './abstract-type.registry';
import { IModuleMetadata } from '../interfaces';
import { useSingleton } from '@lyvely/common';

@Injectable()
export class ModuleRegistry extends AbstractTypeRegistry<any, IModuleMetadata> {
  protected logger = new Logger(ModuleRegistry.name);
}

export const useModuleRegistry = useSingleton(() => new ModuleRegistry());
