import { ModuleMetadata } from '@nestjs/common';

export type IModuleMetadata<T = any> = ModuleMetadata & {
  id: string;
  path: string;
  name: string;
  description?: string;
  options?: Record<string, any>;
} & {
  [K in keyof T]: T[K];
};
