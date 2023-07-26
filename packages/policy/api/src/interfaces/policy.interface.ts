import { Type } from '@nestjs/common';

export interface IPolicy<C> {
  validate(context: C): Promise<boolean>;
}

export type PolicyHandlerCallback<C> = (context: C) => Promise<boolean>;

export type PolicyHandler<C> = IPolicy<C> | Type<IPolicy<C>>;
