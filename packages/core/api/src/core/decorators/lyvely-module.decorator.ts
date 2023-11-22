import { Module } from '@nestjs/common';
import { Type } from '@lyvely/common';
import { IModuleMetadata } from '../interfaces';
import { useModuleRegistry } from '../components';
import { registerFeatures, registerPermissions } from '@lyvely/interface';

export const LyvelyModule = (metadata: IModuleMetadata): ClassDecorator => {
  const { imports, controllers, providers, exports } = metadata;
  const nestModule = Module({ imports, controllers, providers, exports });

  if (metadata.features) {
    registerFeatures(metadata.features);
  }

  if (metadata.permissions) {
    registerPermissions(metadata.permissions);
  }

  return (target: Function) => {
    nestModule(target);
    useModuleRegistry().registerType(target as Type, metadata.id, metadata);
  };
};
