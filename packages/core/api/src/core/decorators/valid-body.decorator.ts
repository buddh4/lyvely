import {
  Body,
  type PipeTransform,
  type Type,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import { omit } from 'lodash';

export interface IValidBodyOptions extends ValidationPipeOptions {
  pipes?: (Type<PipeTransform> | PipeTransform)[];
}

export function ValidBody(): ParameterDecorator;
export function ValidBody(property?: string, options?: IValidBodyOptions): ParameterDecorator;
export function ValidBody(
  property?: string | IValidBodyOptions,
  options?: IValidBodyOptions
): ParameterDecorator {
  const bodyProperty = typeof property === 'string' ? property : null;
  const bodyOptions = typeof property === 'object' ? property : options;

  const pipes = bodyOptions?.pipes || [];
  pipes.push(new ValidationPipe(omit(bodyOptions, 'pipes')));

  const body = bodyProperty ? Body(bodyProperty, ...pipes) : Body(...pipes);
  return (target: Object, propertyKey: string | symbol | undefined, parameterIndex: number) => {
    body(target, propertyKey, parameterIndex);
  };
}
