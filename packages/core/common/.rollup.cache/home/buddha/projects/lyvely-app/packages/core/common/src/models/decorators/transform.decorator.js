import { Type } from 'class-transformer';
export const TransformTo = (type) => Type(() => type);
