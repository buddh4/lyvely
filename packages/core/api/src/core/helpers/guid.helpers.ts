import { createHash } from 'crypto';
import { createObjectId } from '../db';
import type { GUID } from '@lyvely/common';

export const uniqueGuid = (algo: GUID = 'md5') => {
  return createHash(algo).update(createObjectId().toString()).digest('hex');
};

export const variantGuid = (original: string, variant: string, algo: GUID = 'md5') => {
  return createHash(algo)
    .update(original + ':::' + variant)
    .digest('hex');
};
