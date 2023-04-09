import { Type as ClassType } from '@/utils';
import { Type } from 'class-transformer';

export const TransformTo = (type: ClassType) => Type(() => type);
