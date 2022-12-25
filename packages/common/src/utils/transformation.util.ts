import { Transform } from 'class-transformer';

export const TransformObjectId = () =>
  Transform(({ value, obj }) => (value && 'toString' in value ? value.toString() : value));
