import { ClsStore } from 'nestjs-cls';

export interface TenancyStore extends ClsStore {
  oid?: string;
}
