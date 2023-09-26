import { ModuleMetadata } from '@nestjs/common';

export interface IModuleMetadata extends ModuleMetadata {
  id: string;
  path: string;
  name: string;
  description?: string;
  options?: Record<string, any>;
}
