import { Transform } from 'class-transformer';

export const TransformObjectId = () =>
  Transform(({ value }) => (value && 'toString' in value ? value.toString() : value));
