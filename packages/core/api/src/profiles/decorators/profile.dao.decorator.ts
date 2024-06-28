import { type BaseDocument, Dao, type IDaoMetadata } from '@/core';
import type { Type } from '@lyvely/common';
import { TenancyIsolation } from '@/core/tenancy';

export const ProfileDao = <T extends BaseDocument>(
  type: Type<T>,
  meta?: Omit<IDaoMetadata<T>, 'type' | 'isolation'>
): ClassDecorator => {
  const dao = Dao(type, { ...meta, isolation: TenancyIsolation.Profile });

  return (target: any) => {
    dao(target);
    return target;
  };
};
