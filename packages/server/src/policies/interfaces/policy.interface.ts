import { Type } from '@nestjs/common';

export interface Policy<C> {
  validate(context: C): Promise<boolean>;
}

export type PolicyHandlerCallback<C> = (context: C) => Promise<boolean>;

export type PolicyHandler<C> = Policy<C> | Type<Policy<C>>;