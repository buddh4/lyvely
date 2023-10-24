import { ModuleMetadata } from '@nestjs/common';
import { IFeature, IPermission } from '@lyvely/core-interface';

export type IModuleMetadata<T = any> = ModuleMetadata & {
  id: string;
  path: string;
  name: string;
  description?: string;
  features?: IFeature[];
  permissions?: IPermission<any>[];
  options?: Record<string, any>;
} & {
  [K in keyof T]: T[K];
};
