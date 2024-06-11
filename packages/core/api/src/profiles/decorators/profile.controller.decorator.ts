import { Controller, UseGuards } from '@nestjs/common';
import { ProfileGuard } from '../guards';
import { CanActivate } from '@nestjs/common/interfaces';
import { PolicyGuard } from '@/policies/guards';
import type { IControllerOptions } from '@/common';
import { UseClassSerializer } from '@/core';

// eslint-disable-next-line @typescript-eslint/ban-types
export const ProfileController = (
  prefix: string | string[],
  options?: IControllerOptions
): ClassDecorator => {
  const controller = Controller(prefix);
  const useClassSerializer = UseClassSerializer();
  const guards = options?.guards || [];
  const profileGuard = ProfileEndpoint(...guards);

  return function (target: any) {
    controller(target);
    profileGuard(target);
    if (options?.serialize !== false) {
      useClassSerializer(target);
    }
  };
};

export const ProfileEndpoint = (
  ...guards: (CanActivate | Function)[]
): MethodDecorator & ClassDecorator => {
  const profileGuard = UseGuards(ProfileGuard, PolicyGuard, ...guards);

  return function (target: any, key?: string | symbol, descriptor?: TypedPropertyDescriptor<any>) {
    if (key && descriptor) {
      profileGuard(target, key, descriptor);
    }
    profileGuard(target);
  };
};
