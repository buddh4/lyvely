import { Controller as NestController, UseGuards } from '@nestjs/common';
import { CanActivate } from '@nestjs/common/interfaces';
import { GlobalPermissionsGuard } from '../guards';

// eslint-disable-next-line @typescript-eslint/ban-types
export const Controller = (
  prefix: string | string[],
  ...guards: (CanActivate | Function)[]
): ClassDecorator => {
  const controller = NestController(prefix);
  const publicGuards = UseGuards(GlobalPermissionsGuard, ...guards);

  return function (target: any) {
    controller(target);
    publicGuards(target);
  };
};
