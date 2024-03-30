import { createHash } from 'crypto';
import { createObjectId } from '../db';

export const uniqueGuid = () => {
  return createHash('sha256').update(createObjectId().toString()).digest('hex');
};
