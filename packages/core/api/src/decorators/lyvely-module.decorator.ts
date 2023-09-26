import { Module } from '@nestjs/common';
import { Type } from '@lyvely/common';
import { IModuleMetadata } from '../interfaces';
import { useModuleRegistry } from '../components/module.registry';

export const LyvelyModule = (metadata: IModuleMetadata): ClassDecorator => {
  const { imports, controllers, providers, exports } = metadata;
  const nestModule = Module({ imports, controllers, providers, exports });

  return (target: Function) => {
    nestModule(target);
    useModuleRegistry().registerType(target as Type, metadata.id, metadata);
  };
};
