import {
  Query,
  type PipeTransform,
  type Type,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import { omit } from '@lyvely/common';

export interface IValidQueryOptions extends ValidationPipeOptions {
  pipes?: (Type<PipeTransform> | PipeTransform)[];
}

export function ValidQuery(): ParameterDecorator;
export function ValidQuery(property?: string, options?: IValidQueryOptions): ParameterDecorator;
export function ValidQuery(
  property?: string | IValidQueryOptions,
  options?: IValidQueryOptions
): ParameterDecorator {
  const bodyProperty = typeof property === 'string' ? property : null;
  const bodyOptions = typeof property === 'object' ? property : options;

  const pipes = bodyOptions?.pipes || [];
  pipes.push(new ValidationPipe(omit(bodyOptions, 'pipes')));

  const body = bodyProperty ? Query(bodyProperty, ...pipes) : Query(...pipes);
  return (target: Object, propertyKey: string | symbol | undefined, parameterIndex: number) => {
    body(target, propertyKey, parameterIndex);
  };
}
