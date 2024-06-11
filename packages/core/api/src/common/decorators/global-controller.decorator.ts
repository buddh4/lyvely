import { Controller as NestController, UseGuards } from '@nestjs/common';
import { CanActivate } from '@nestjs/common/interfaces';
import { GlobalPermissionsGuard } from '@/permissions/guards/global-permissions.guard';
import { UseClassSerializer } from '@/core';

export interface IControllerOptions {
  guards?: (CanActivate | Function)[];
  serialize?: boolean;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const GlobalController = (
  prefix: string | string[],
  options?: IControllerOptions
): ClassDecorator => {
  const controller = NestController(prefix);
  const useClassSerializer = UseClassSerializer();
  const guards = options?.guards || [];
  const useGuards = UseGuards(GlobalPermissionsGuard, ...guards);

  return function (target: any) {
    controller(target);
    useGuards(target);
    if (options?.serialize !== false) {
      useClassSerializer(target);
    }
  };
};
