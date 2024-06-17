import { ClsStore } from 'nestjs-cls';
import type { TObjectId } from '@/core/db/interfaces';

export interface LyvelyStore<TContext = any> extends ClsStore {
  oid?: TObjectId;
  context?: TContext;
}
