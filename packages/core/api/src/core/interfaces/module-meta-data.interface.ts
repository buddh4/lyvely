import { ModuleMetadata } from '@nestjs/common';
import { IFeature } from '@lyvely/core-interface';

export type IModuleMetadata<T = any> = ModuleMetadata & {
  id: string;
  path: string;
  name: string;
  description?: string;
  features?: IFeature[];
  options?: Record<string, any>;
} & {
  [K in keyof T]: T[K];
};
