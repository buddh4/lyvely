import { Transform } from 'class-transformer';

export const TransformObjectId = () => Transform(({ value, obj }) => obj._id?.toString() || value);
