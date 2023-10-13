import { Module } from '@nestjs/common';
import { Type } from '@lyvely/common';
import { IModuleMetadata } from '../interfaces';
import { useModuleRegistry } from '../components';
import { registerFeatures } from '@lyvely/core-interface';

export const LyvelyModule = (metadata: IModuleMetadata): ClassDecorator => {
  const { imports, controllers, providers, exports } = metadata;
  const nestModule = Module({ imports, controllers, providers, exports });

  if (metadata.features) {
    registerFeatures(metadata.features);
  }

  return (target: Function) => {
    nestModule(target);
    useModuleRegistry().registerType(target as Type, metadata.id, metadata);
  };
};
